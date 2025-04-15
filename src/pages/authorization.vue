<template>
  <div class="login-page">
    <div class="login-container">
      <h1 class="login-title">Вход в систему колледжа</h1>
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email" class="input-label">Учебный Email:</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <input type="email" id="email" v-model="email" required placeholder="student@college.edu"
              class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label for="password" class="input-label">Пароль:</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path
                d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            <input type="password" id="password" v-model="password" required placeholder="Введите ваш пароль"
              class="form-input" />
          </div>
        </div>
        <button type="submit" :disabled="loading" class="submit-btn">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Проверка данных...' : 'Войти в систему' }}
        </button>
        <div v-if="error" class="error-message">
          <svg viewBox="0 0 24 24" class="error-icon">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {{ error }}
        </div>
      </form>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_URL = "https://api.newlxp.ru/graphql";

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.error = '';

      try {

        const authResponse = await this.signIn();


        if (!authResponse || !authResponse.user || !authResponse.accessToken) {
          throw new Error('Неверный формат ответа сервера');
        }

        const token = authResponse.accessToken;
        const userId = authResponse.user.id;


        const diary = await this.getDiary(token, userId);
        const userData = await this.getUserData(token);
        localStorage.setItem('access', token);
        localStorage.setItem('student', JSON.stringify(userData));
        localStorage.setItem('diary', JSON.stringify(diary));



      } catch (error) {
        this.error = error.message || 'Ошибка входа. Проверьте данные и попробуйте снова.';
        console.error('Ошибка входа:', error);
      } finally {
        this.loading = false;
      }
    },



    async getDiary(token, studentId) {
   
      const now = new Date();

      const query = `
    query DiaryQuery($studentId: UUID!) {
      searchStudentDisciplines(input: { studentId: $studentId }) {
        discipline {
          id
          name
          code
          studyPeriods {
            id
            name
            startDate
            endDate
            __typename
          }
          teachers {
            user {
              lastName
              firstName
              middleName
            }
          }
        }
        disciplineGrade
        maxScoreForAnsweredTasks
        scoreForAnsweredTasks
        disciplineAttendance {
          percent
          total
          visited
        }
      }
    }
  `;

      const variables = { studentId };
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "apollographql-client-name": "web"
      };

      const response = await axios.post(API_URL, { query, variables }, { headers });

      if (response.data.errors) {
        throw new Error('Не удалось получить данные дневника');
      }

      const allDisciplines = response.data.data.searchStudentDisciplines;

      const currentSemesterDisciplines = allDisciplines.filter(item => {
        if (!item.discipline.studyPeriods || item.discipline.studyPeriods.length === 0) {
          return false;
        }

   
        const activePeriod = item.discipline.studyPeriods.find(period => {
          const startDate = new Date(period.startDate);
          const endDate = new Date(period.endDate);
          return now >= startDate && now <= endDate;
        });

        return !!activePeriod;
      });

      return currentSemesterDisciplines;
    },

    async signIn() {
      const query = `
          query SignIn($input: SignInInput!) {
            signIn(input: $input) {
              user {
                id
                isLead
                __typename
              }
              accessToken
              __typename
            }
          }
        `;

      const variables = {
        input: {
          email: this.email,
          password: this.password
        }
      };

      const response = await axios.post(API_URL, { query, variables });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data.signIn;
    },

    async getUserData(token) {
      const query = `
          query GetMe {
            getMe {
              avatar
              createdAt
              email
              firstName
              id
              isLead
              roles
              phoneNumber
              legalDocumentsApprovedAt
              notificationsSettings {
                isPushDailyDigestOnEmail
                __typename
              }
              assignedSuborganizations {
                suborganization {
                  name
                  __typename
                }
                  __typename
              }
              teacher {
                assignedDisciplines_V2 {
                  discipline {
                    name
                    code
                    studyPeriods {
                      name
                      startDate
                      endDate
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
          }
        `;

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(API_URL, { query }, { headers });

      if (response.data.errors) {
        throw new Error('Не удалось получить данные пользователя');
      }

      return response.data.data.getMe;
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.login-title {
  color: #6a1b9a;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
  position: relative;
}

.login-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: #6a1b9a;
  margin: 15px auto 0;
  border-radius: 3px;
}

.login-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 25px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  fill: #6a1b9a;
}

.form-input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: white;
  color: #333;
}

.form-input:focus {
  border-color: #6a1b9a;
  box-shadow: 0 0 0 2px rgba(106, 27, 154, 0.2);
  outline: none;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #6a1b9a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.submit-btn:hover {
  background-color: #5a147a;
  box-shadow: 0 4px 8px rgba(106, 27, 154, 0.3);
}

.submit-btn:active {
  transform: translateY(1px);
}

.submit-btn:disabled {
  background-color: #b39ddb;
  cursor: not-allowed;
  box-shadow: none;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  margin-top: 20px;
  padding: 12px 15px;
  background-color: #ffebee;
  border-radius: 6px;
  color: #c62828;
  font-size: 14px;
  display: flex;
  align-items: center;
  border-left: 3px solid #c62828;
}

.error-icon {
  width: 18px;
  height: 18px;
  fill: #c62828;
  margin-right: 10px;
}

.login-footer {
  margin-top: 25px;
  text-align: center;
  font-size: 14px;
  color: #666;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.login-footer p {
  margin: 8px 0;
}

.footer-link {
  color: #6a1b9a;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.footer-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
    border-radius: 6px;
  }

  .login-title {
    font-size: 20px;
  }
}
</style>