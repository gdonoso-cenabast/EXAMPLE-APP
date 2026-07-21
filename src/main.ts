import './style.css';

const app: HTMLDivElement = document.getElementById('app') as HTMLDivElement;

const titulo: HTMLHeadingElement = document.createElement('h1');

titulo.style.fontWeight = 'bold';
titulo.style.color = 'red';
titulo.textContent = 'EJEMPLO DE APP CON JENKINS, SONARQUBE Y GITHUB';

app.appendChild(titulo);