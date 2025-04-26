<template>
    <div class="resume-wrapper" ref="resumeContent">
      <div class="left-column">
        <div class="avatar" :style="{ backgroundImage: 'url(' + student.avatar + ')' }"></div>
  
        <div class="sidebar-section">
          <h3>Желаемая зарплата</h3>
          <p>200 000 рублей</p>
        </div>
  
        <div class="sidebar-section">
          <h3>Занятость</h3>
          <p>Полная, полный рабочий день</p>
        </div>
  
        <div class="sidebar-section">
          <h3>Иностранные языки</h3>
          <ul>
            <li>Русский — родной</li>
            <li>Английский — B1</li>
          </ul>
        </div>
  
        <div class="sidebar-section">
          <h3>Компьютерные навыки</h3>
          <ul>
            <li>JavaScript</li>
            <li>HTML</li>
            <li>CSS</li>
            <li>Vue</li>
            <li>React</li>
            <li>REST API</li>
          </ul>
        </div>
      </div>
  
      <div class="right-column">
        <div class="header">
          <h1>{{ student.lastName }} {{ student.firstName }} {{ student.middleName }}</h1>
          <p><strong>Email:</strong> {{ student.email }}</p>
          <p><strong>Телефон:</strong> {{ student.phoneNumber || '+7 (999) 123-45-67' }}</p>
          <p><strong>Город проживания:</strong> Грозный</p>
        </div>
  
        <div class="section">
          <h2>Личная информация</h2>
          <p><strong>Пол:</strong> Мужской</p>
          <p><strong>Дата рождения:</strong> 25 декабря 2004</p>
          <p><strong>Возраст:</strong> 20 лет</p>
          <p><strong>Гражданство:</strong> Россия</p>
          <p><strong>Семейное положение:</strong> Не женат</p>
          <p><strong>Позиция:</strong> Frontend-разработчик</p>
        </div>
  
        <div class="section">
          <h2>Образование</h2>
          <ul>
            <li><strong>2024</strong> — Hexlet — Frontend-разработчик</li>
            <li><strong>2024</strong> — Соц.-пед. колледж — Правоохранительная деятельность</li>
          </ul>
        </div>
  
        <div class="section">
          <h2>Курсы и тренинги</h2>
          <ul>
            <li>Frontend разработка — Hexlet</li>
            <li>JavaScript базовый — Stepik</li>
          </ul>
        </div>
  
        <div class="section">
          <h2>Дополнительная информация</h2>
          <p><strong>Личные качества:</strong></p>
          <ul>
            <li>Ответственность</li>
            <li>Коммуникабельность</li>
            <li>Желание учиться</li>
            <li>Внимательность</li>
          </ul>
          <p><strong>О себе:</strong> Я начинающий frontend-разработчик, увлечён созданием современных и удобных интерфейсов. Имею опыт работы с Vue, React и взаимодействием с REST API. Постоянно учусь новому, участвую в онлайн-курсах и стремлюсь расти как специалист. Отличаюсь вниманием к деталям, ответственным подходом и готовностью работать в команде. Моя цель — создавать качественные продукты, которыми можно гордиться.</p>
          <p><strong>Хобби:</strong> Фронтенд, дизайн, настольные игры, спорт</p>
        </div>
      </div>
    </div>
  
    <div class="resume-buttons no-print">
      <button @click="downloadPDF">Скачать PDF</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "Resume",
    data() {
      return {
        student: {}
      };
    },
    mounted() {
      const saved = localStorage.getItem("student");
      this.student = saved ? JSON.parse(saved) : {};
      if (!this.student.firstName) {
        this.$router.push("/authorization");
      }
    }
  };
  </script>
  
  <style scoped>
  .resume-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-family: 'Segoe UI', sans-serif;
    max-width: 1100px;
    margin: 60px auto;
    background-color: white;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
    border-radius: 12px;
    overflow: hidden;
    font-size: 18px;
  }
  .left-column {
    width: 35%;
    background-color: #6a1b9a;
    color: white;
    padding: 25px;
    display: flex;
    flex-direction: column;
    gap: 25px;
  }
  .avatar {
    width: 100%;
    height: 220px;
    background-size: cover;
    background-position: center;
    border-radius: 10px;
    border: 3px solid white;
  }
  .sidebar-section {
    font-size: 16px;
  }
  .sidebar-section h3 {
    margin-bottom: 10px;
    font-size: 18px;
    border-bottom: 1px solid white;
  }
  .right-column {
    width: 65%;
    padding: 30px;
    font-size: 17px;
  }
  .header h1 {
    font-size: 28px;
    margin-bottom: 12px;
  }
  .section {
    margin-top: 26px;
  }
  .section h2 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #6a1b9a;
    border-bottom: 1px solid #ccc;
  }
  .resume-buttons {
    display: flex;
    justify-content: center;
    margin: 30px auto 50px;
  }
  button {
    background-color: #6a1b9a;
    color: white;
    padding: 10px 20px;
    font-size: 18px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
  button:hover {
    background-color: #4a148c;
  }
  @media (max-width: 768px) {
    .resume-wrapper {
      flex-direction: column;
      font-size: 16px;
    }
    .left-column,
    .right-column {
      width: 100%;
    }
    .left-column {
      padding: 20px;
    }
    .right-column {
      padding: 20px;
    }
  }
  @media print {
    .no-print {
      display: none;
    }
  }
  </style>