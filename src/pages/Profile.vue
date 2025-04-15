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
                </div>

                <div class="profile-details">
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
                        <div class="label">Почта:</div>
                        <div class="value email">{{ student.email }}</div>
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
                    <div class="stat-label">Общая посещаемость</div>
                </div>
            </div>

            <div class="diary-table-container">
                <table class="diary-table">
                    <thead>
                        <tr>
                            <th>Название дисциплины</th>
                            <th>Баллы</th>
                            <th>Оценка</th>
                            <th>Посещаемость</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(subject, index) in diary" :key="index">
                            <td class="subject-name">{{ subject.discipline.name }}</td>
                            <td>
                                <!-- <div class="progress-container">
                                    <div class="progress-bar" :style="{width: (subject.points / subject.maxPoints * 100) + '%'}"></div>
                                    <span class="progress-text">{{ subject.points }}</span>
                                </div> -->

                                {{ subject.scoreForAnsweredTasks }} из {{ subject.maxScoreForAnsweredTasks }} / 100
                            </td>
                            <td>
                                <div class="grade" :class="'grade-' + subject.disciplineGrade">{{ subject.disciplineGrade }}</div>
                            </td>
                            <td>
                                <div class="attendance">
                                    <div class="attendance-progress">
                                        <div class="attendance-bar"
                                            :style="{ width: subject.disciplineAttendance.percent + '%' }"></div>
                                    </div>
                                    <div class="attendance-text">{{ subject.disciplineAttendance.visited }} из {{
                                        subject.disciplineAttendance.total }} / {{ subject.disciplineAttendance.percent }}%</div>
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
        console.log(this.student);
        console.log(this.diary);
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
}

};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.student-profile {
    font-family: 'Roboto', Arial, sans-serif;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    color: var(--text-primary);
    background-color: #f8f8f8;
}

/* Стилизация карточек */
.profile-card,
.diary-card {
    background-color: var(--white);
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(123, 56, 232, 0.1);
    margin-bottom: 30px;
    overflow: hidden;
}

/* Заголовки разделов */
.profile-header,
.diary-header {
    background-color: var(--primary);
    color: var(--white);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

h1,
h2 {
    margin: 0;
    font-weight: 500;
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
}

.profile-photo {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
    background-color: var(--secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(123, 56, 232, 0.15);
    border: 3px solid var(--primary-light);
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
    font-size: 72px;
}

/* Информация профиля */
.profile-details {
    flex: 1;
    padding: 10px 0;
}

.profile-row {
    display: flex;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--secondary);
    padding-bottom: 12px;
}

.label {
    width: 120px;
    font-weight: 500;
    color: var(--text-secondary);
}

.value {
    flex: 1;
    font-weight: 400;
}

.email {
    color: var(--primary);
    text-decoration: underline;
}

/* Селектор семестра */
.semester-selector {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--white);
}

.semester-selector select {
    background-color: var(--primary-dark);
    color: var(--white);
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
}

/* Статистика дневника */
.diary-stats {
    display: flex;
    justify-content: space-around;
    background-color: var(--secondary);
    padding: 20px 0;
    margin-bottom: 20px;
}

.stat-item {
    text-align: center;
}

.stat-value {
    font-size: 36px;
    font-weight: 700;
    color: var(--primary);
}

.stat-label {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 4px;
}

/* Контейнер таблицы */
.diary-table-container {
    padding: 0 20px 20px;
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
}

.diary-table tr:last-child td {
    border-bottom: none;
}

/* Название предмета */
.subject-name {
    max-width: 250px;
    font-weight: 500;
    color: var(--primary-dark);
}

/* Прогресс-бар для баллов */
.progress-container {
    width: 100%;
    height: 20px;
    background-color: var(--secondary);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: var(--primary);
    border-radius: 10px;
    transition: width 0.3s ease;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--text-primary);
    font-size: 12px;
    font-weight: 700;
}

/* Оценки */
.grade {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: var(--white);
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
    gap: 6px;
}

.attendance-progress {
    height: 6px;
    background-color: #e9e9e9;
    border-radius: 3px;
    overflow: hidden;
}

.attendance-bar {
    height: 100%;
    background-color: var(--primary);
}

.attendance-text {
    font-size: 12px;
    color: var(--text-secondary);
}

/* Адаптивность */
@media (max-width: 768px) {
    .profile-content {
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .profile-details {
        width: 100%;
    }

    .diary-stats {
        padding: 10px 0;
    }

    .stat-value {
        font-size: 28px;
    }
}

@media (max-width: 576px) {

    .profile-header,
    .diary-header {
        flex-direction: column;
        gap: 10px;
    }

    .semester-selector {
        width: 100%;
        justify-content: space-between;
    }

    .diary-table th,
    .diary-table td {
        padding: 12px 8px;
        font-size: 14px;
    }
}
</style>