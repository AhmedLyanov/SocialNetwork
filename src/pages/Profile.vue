<template>
    <div class="student-profile">
        <div class="profile-card">
            <div class="profile-header">
                <h1>Профиль ученика</h1>
            </div>

            <div class="profile-content">
                <div class="profile-photo-section">
                    <div class="profile-photo">
                        <img :src="student.avatar" alt="Фото профиля" v-if="student.avatar">
                        <div class="no-photo" v-else>
                            <i class="material-icons">person</i>
                        </div>
                    </div>
                    <div class="contact-info">
                        <a :href="'mailto:' + student.email" class="contact-item">
                            <i class="material-icons">email</i>
                            <span>{{ student.email }}</span>
                        </a>
                        <a :href="'tel:' + student.phoneNumber" class="contact-item" v-if="student.phoneNumber">
                            <i class="material-icons">phone</i>
                            <span>{{student.phoneNumber}}</span>
                        </a>
                    </div>
                </div>

                <div class="profile-details">
                    <div class="profile-section">
                        <h3>Основная информация</h3>
                        <div class="profile-row">
                            <div class="label">Фамилия:</div>
                            <div class="value">{{ student.lastName }}</div>
                        </div>
                        <div class="profile-row">
                            <div class="label">Имя:</div>
                            <div class="value">{{ student.firstName }}</div>
                        </div>
                        <div class="profile-row">
                            <div class="label">Отчество:</div>
                            <div class="value">{{ student.middleName }}</div>
                        </div>
                        <div class="profile-row">
                            <div class="label">Дата регистрации:</div>
                            <div class="value">{{ formatDate(student.createdAt) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="diary-card" v-if="diary.length">
            <div class="diary-header">
                <h2>Академический дневник</h2>
            </div>

            <div class="diary-stats">
                <div class="stat-item">
                    <div class="stat-value">{{ averageGrade }}</div>
                    <div class="stat-label">Средний балл</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ totalAttendancePercent }}%</div>
                    <div class="stat-label">Посещаемость</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ diary.length }}</div>
                    <div class="stat-label">Дисциплин</div>
                </div>
            </div>

            <div class="diary-table-container">
                <table class="diary-table">
                    <thead>
                        <tr>
                            <th>Дисциплина</th>
                            <th>Прогресс</th>
                            <th>Оценка</th>
                            <th>Посещаемость</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(subject, index) in diary" :key="index">
                            <td class="subject-name">
                                <div class="subject-title">{{ subject.discipline.name }}</div>
                            </td>
                            <td>
                                <div class="progress-container">
                                    <div class="progress-bar" 
                                         :style="{width: (subject.scoreForAnsweredTasks / subject.maxScoreForAnsweredTasks * 100) + '%'}">
                                    </div>
                                    <span class="progress-text">
                                        {{ subject.scoreForAnsweredTasks }} / {{ subject.maxScoreForAnsweredTasks }}
                                    </span>
                                </div>
                            </td>
                            <td>
                                <div class="grade" :class="'grade-' + subject.disciplineGrade">
                                    {{ subject.disciplineGrade }}
                                </div>
                            </td>
                            <td>
                                <div class="attendance">
                                    <div class="attendance-progress">
                                        <div class="attendance-bar"
                                            :style="{ width: subject.disciplineAttendance.percent + '%' }"></div>
                                    </div>
                                    <div class="attendance-text">
                                        {{ subject.disciplineAttendance.visited }} из {{ subject.disciplineAttendance.total }}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StudentProfile',
    data() {
        return {
            student: {},
            diary: []
        };
    },
    mounted() {
        this.student = JSON.parse(localStorage.getItem("student")) || {}
        this.diary = JSON.parse(localStorage.getItem("diary")) || []
        if(!this.student.firstName){
            this.$router.push("/authorization")
        }
    },
    computed: {
        averageGrade() {
            if (this.diary.length === 0) return 0;
            const sum = this.diary.reduce((acc, subject) => acc + subject.disciplineGrade, 0);
            return (sum / this.diary.length).toFixed(1);
        },
        totalAttendancePercent() {
            if (this.diary.length === 0) return 0;
            const total = this.diary.reduce((acc, subject) => acc + subject.disciplineAttendance.percent, 0);
            return Math.round(total / this.diary.length);
        }
    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return 'Не указано';
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        formatPhoneNumber(phone) {
            if (!phone) return '';
            // Форматирование российского номера телефона
            return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

:root {
    --primary: #7b38e8;
    --primary-light: #9d65f3;
    --primary-dark: #5c1bc0;
    --secondary: #f5f2ff;
    --white: #ffffff;
    --text-primary: #2d2d2d;
    --text-secondary: #6b6b6b;
    --border: #e0e0e0;
    --success: #4caf50;
    --warning: #ff9800;
    --danger: #f44336;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.student-profile {
    font-family: 'Roboto', Arial, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
    color: var(--text-primary);
    background-color: #f8f8f8;
}

/* Стилизация карточек */
.profile-card,
.diary-card {
    background-color: var(--white);
    border-radius: 16px;
    box-shadow: var(--shadow);
    margin-bottom: 30px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover,
.diary-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(123, 56, 232, 0.15);
}

/* Заголовки разделов */
.profile-header,
.diary-header {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: var(--white);
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

h1, h2, h3 {
    margin: 0;
    font-weight: 500;
}

h1 {
    font-size: 28px;
}

h2 {
    font-size: 24px;
}

h3 {
    font-size: 20px;
    color: var(--primary-dark);
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--secondary);
}

/* Содержимое профиля */
.profile-content {
    display: flex;
    padding: 30px;
    gap: 40px;
}

/* Фото профиля */
.profile-photo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 280px;
}

.profile-photo {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    background-color: var(--secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px rgba(123, 56, 232, 0.2);
    border: 4px solid var(--primary-light);
    margin-bottom: 24px;
}

.profile-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.no-photo {
    color: var(--primary);
    font-size: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.no-photo .material-icons {
    font-size: 80px;
}

/* Контактная информация */
.contact-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-primary);
    text-decoration: none;
    padding: 10px 16px;
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.contact-item:hover {
    background-color: var(--secondary);
}

.contact-item .material-icons {
    color: var(--primary);
    font-size: 20px;
}

.contact-item span {
    font-size: 15px;
}

/* Информация профиля */
.profile-details {
    flex: 1;
    padding: 10px 0;
}

.profile-section {
    margin-bottom: 24px;
}

.profile-row {
    display: flex;
    margin-bottom: 14px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    align-items: center;
}

.label {
    width: 160px;
    font-weight: 500;
    color: var(--text-secondary);
    font-size: 15px;
}

.value {
    flex: 1;
    font-weight: 400;
    font-size: 16px;
}

/* Статистика дневника */
.diary-stats {
    display: flex;
    justify-content: space-around;
    background-color: var(--secondary);
    padding: 24px 0;
    margin-bottom: 20px;
}

.stat-item {
    text-align: center;
    padding: 0 20px;
}

.stat-value {
    font-size: 42px;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 4px;
}

.stat-label {
    font-size: 15px;
    color: var(--text-secondary);
    font-weight: 500;
}

/* Контейнер таблицы */
.diary-table-container {
    padding: 0 24px 24px;
    overflow-x: auto;
}

/* Стилизация таблицы */
.diary-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 8px;
    overflow: hidden;
}

.diary-table th,
.diary-table td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid var(--border);
}

.diary-table th {
    background-color: var(--secondary);
    color: var(--primary-dark);
    font-weight: 500;
    position: sticky;
    top: 0;
    font-size: 15px;
}

.diary-table tr:last-child td {
    border-bottom: none;
}

.diary-table tr:hover td {
    background-color: rgba(123, 56, 232, 0.05);
}

/* Название предмета */
.subject-name {
    min-width: 200px;
}

.subject-title {
    font-weight: 500;
    color: var(--primary-dark);
}

/* Прогресс-бар для баллов */
.progress-container {
    width: 100%;
    height: 24px;
    background-color: var(--secondary);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--primary-light));
    border-radius: 12px;
    transition: width 0.5s ease;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--white);
    font-size: 12px;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Оценки */
.grade {
    display: inline-block;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: var(--white);
    font-size: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.grade-5 {
    background-color: var(--success);
}

.grade-4 {
    background-color: var(--primary);
}

.grade-3 {
    background-color: var(--warning);
}

.grade-2 {
    background-color: var(--danger);
}

/* Посещаемость */
.attendance {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.attendance-progress {
    height: 8px;
    background-color: #e9e9e9;
    border-radius: 4px;
    overflow: hidden;
}

.attendance-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--primary-light));
    transition: width 0.5s ease;
}

.attendance-text {
    font-size: 13px;
    color: var(--text-secondary);
    text-align: center;
}

/* Анимации */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.profile-card,
.diary-card {
    animation: fadeIn 0.6s ease forwards;
}

.diary-card {
    animation-delay: 0.2s;
}

/* Адаптивность */
@media (max-width: 992px) {
    .profile-content {
        flex-direction: column;
        align-items: center;
        gap: 30px;
    }

    .profile-photo-section {
        flex-direction: row;
        align-items: flex-start;
        gap: 30px;
        width: 100%;
    }

    .contact-info {
        margin-top: 20px;
    }
}

@media (max-width: 768px) {
    .profile-content {
        padding: 20px;
    }

    .diary-stats {
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }

    .stat-item {
        padding: 0;
    }

    .profile-photo-section {
        flex-direction: column;
        align-items: center;
    }

    .profile-photo {
        width: 150px;
        height: 150px;
    }
}

@media (max-width: 576px) {
    .student-profile {
        padding: 15px 10px;
    }

    .profile-header,
    .diary-header {
        padding: 16px;
    }

    h1 {
        font-size: 24px;
    }

    h2 {
        font-size: 20px;
    }

    .profile-content {
        padding: 16px;
    }

    .diary-table th,
    .diary-table td {
        padding: 12px 8px;
        font-size: 14px;
    }

    .label {
        width: 120px;
        font-size: 14px;
    }

    .value {
        font-size: 15px;
    }

    .stat-value {
        font-size: 36px;
    }
}
</style>