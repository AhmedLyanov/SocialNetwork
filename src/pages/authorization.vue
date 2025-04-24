<template>
  <div class="login-page">
    <div class="login-container">
      <h1 class="login-title">Добро пожаловать!</h1>
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="container_iputs_form">
          <div class="form-group">
            <div class="input-wrapper">
              <input
                type="email"
                id="email"
                v-model="email"
                required
                placeholder="Имя пользователя"
                class="form-input"
              />
            </div>
          </div>
          <div class="form-group">
            <div class="input-wrapper">
              <input
                type="password"
                id="password"
                v-model="password"
                required
                placeholder="Пароль"
                class="form-input"
              />
            </div>
          </div>
        </div>
        <button type="submit" :disabled="loading" class="submit-btn">
          <svg
            v-if="!loading"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="#272727"
            xmlns="http://www.w3.org/2000/svg"
            class="btn-icon"
          >
            <path
              d="M12.5 21V19H19.5V5H12.5V3H19.5C20.05 3 20.521 3.196 20.913 3.588C21.305 3.98 21.5007 4.45067 21.5 5V19C21.5 19.55 21.3043 20.021 20.913 20.413C20.5217 20.805 20.0507 21.0007 19.5 21H12.5ZM10.5 17L9.125 15.55L11.675 13H3.5V11H11.675L9.125 8.45L10.5 7L15.5 12L10.5 17Z"
            />
          </svg>
          <span v-if="loading" class="spinner"></span>
          <span class="btn-text">{{
            loading ? "Проверка данных..." : "Войти"
          }}</span>
        </button>
        <div class="forget_password_policy">
          <div class="forget_password_security">
            <span class="span_forget_password" id="forget_password"
              >Забыли пароль?</span
            >
          </div>
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const API_URL = "https://api.newlxp.ru/graphql";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      error: "",
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.error = "";

      try {
        const authResponse = await this.signIn();

        if (!authResponse || !authResponse.user || !authResponse.accessToken) {
          throw new Error("Неверный формат ответа сервера");
        }

        const token = authResponse.accessToken;
        const userId = authResponse.user.id;

        const diary = await this.getDiary(token, userId);
        const userData = await this.getUserData(token);
        localStorage.setItem("access", token);
        localStorage.setItem("student", JSON.stringify(userData));
        localStorage.setItem("diary", JSON.stringify(diary));
        this.$router.push("/profile");
      } catch (error) {
        this.error =
          error.message || "Ошибка входа. Проверьте данные и попробуйте снова.";
        console.error("Ошибка входа:", error);
      } finally {
        this.loading = false;
      }
    },

    async getDiary(token, studentId) {
      const now = new Date();

      const query = `
    query DiaryQuery($studentId: UUID!) {
      searchStudentDisciplines(input: { studentId: $studentId, filters: { studyPeriodId: "9d2b0f2d-52b2-4fff-8459-c5a46c51bbaf" } }) {
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
        "apollographql-client-name": "web",
      };

      const response = await axios.post(
        API_URL,
        { query, variables },
        { headers }
      );

      if (response.data.errors) {
        throw new Error("Не удалось получить данные дневника");
      }

      const allDisciplines = response.data.data.searchStudentDisciplines;

      return allDisciplines;
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
          password: this.password,
        },
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
              lastName
              firstName
              middleName
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
        throw new Error("Не удалось получить данные пользователя");
      }

      return response.data.data.getMe;
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: rgba(15, 11, 31, 1);
  font-family: "Segoe UI", "Roboto", sans-serif;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 465px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.login-title {
  color: rgba(255, 255, 255, 1);
  font-family: "Cabin", sans-serif;
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 53px;
  text-align: center;
  /* position: relative; */
  line-height: 140%;
}

.forget_password_policy {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 35px;
}

.span_forget_password {
  color: rgba(255, 255, 255, 1);
  font-family: "Cabin", sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 143%;
  letter-spacing: 0px;
  text-align: center;
}
.span_forget_password:hover{
  text-decoration: underline;
  cursor: pointer;
}
.login-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 12px;
}

.container_iputs_form {
  display: grid;
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
  padding: 12px 15px 12px 12px;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: transparent;
  color: #ffffff;
}

.form-input:focus {
  border-color: #6a1b9a;
  box-shadow: 0 0 0 2px rgba(106, 27, 154, 0.2);
  outline: none;
}

.forget_password_policy {
  width: 100%;
  display: flex;
  justify-content: center;
  user-select: none;
}

.forget_password_policy .forget_password_security {
  background: transparent;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 16px;
  font-family: "Cabin", sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 53px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  color: #272727;
}

.submit-btn:hover {
  background-color: #5a147a;
  box-shadow: 0 4px 8px rgba(106, 27, 154, 0.3);
  color: white;
}

.submit-btn:hover .btn-icon {
  fill: white;
}

.btn-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
}

.btn-icon {
  order: -1;
  width: 25px;
  height: 24px;
  flex-shrink: 0;
  transition: fill 0.3s ease;
}

.spinner {
  order: -1;
  width: 18px;
  height: 18px;
  border: 3px solid rgba(39, 39, 39, 0.3);
  border-radius: 50%;
  border-top-color: #272727;
  animation: spin 1s ease-in-out infinite;
  flex-shrink: 0;
}

.submit-btn:hover {
  background-color: #5a147a;
  box-shadow: 0 4px 8px rgba(106, 27, 154, 0.3);
  color: white;
}

.submit-btn:active {
  transform: translateY(1px);
}

.submit-btn:disabled {
  background-color: #b39ddb;
  cursor: not-allowed;
  box-shadow: none;
}

.submit-btn:hover .spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
}

.btn-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
