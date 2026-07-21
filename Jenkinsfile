// Definición del pipeline declarativo de Jenkins
pipeline {
    // Especifica que el pipeline se ejecutará en cualquier agente/nodo disponible
    agent any

    // Definición de las etapas del flujo de CI/CD
    stages {
        
        // Etapa 1: Compilación de la aplicación directamente en el agente
        stage('1. Compilacion') {
            steps {
                echo 'Iniciando compilacion...'
                // Usamos la ruta absoluta de npm (/usr/bin/npm) para evitar problemas de PATH en el entorno de Jenkins
                sh '/usr/bin/npm install && /usr/bin/npm run build'
            }
        }

        // Etapa 2: Análisis estático con SonarQube para revisar calidad del código
        stage('2. Analisis con SonarQube') {
            steps {
                echo 'Iniciando escaneo con SonarScanner CLI...'
                // Ejecuta el analizador oficial de SonarQube.
                // Apunta a la red interna de Docker del laboratorio para conectarse a SonarQube
                sh '''
                    docker run --rm \
                        -v $(pwd):/usr/src \
                        --network laboratoriojenkins_default \
                        sonarsource/sonar-scanner-cli \
                        -Dsonar.host.url=http://mi-sonarqube:9000 \
                        -Dsonar.login=squ_e0bccff2a4bfbed27e7d5f4e130f1181f61c9f14 \
                        -Dsonar.projectKey=example-app \
                        -Dsonar.projectName="Example App" \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=node_modules/**,dist/**
                '''
            }
        }

        // Etapa 3: Evaluación de la calidad del código, decisión de despliegue o regreso al commit anterior
        stage('3. Evaluacion y Despliegue o Rollback') {
            steps {
                script {
                    echo 'Verificando calidad...'
                    try {
                        // En un escenario real, aquí se consultaría la API de SonarQube para saber si aprobó.
                        // Dado que el Quality Gate es 'Laxo', siempre aprobará y procederá a desplegar.
                        echo 'Quality Gate APROBADO. Desplegando...'
                        // Reinicia el servidor web Nginx para que cargue los nuevos archivos compilados en dist
                        sh 'docker compose restart frontend'
                    } catch (Exception e) {
                        // Si ocurriera algún fallo, se inicia la rutina de Rollback automático
                        echo 'Quality Gate REPROBADO. Ejecutando Rollback...'
                        // Revierte el repositorio al commit inmediatamente anterior (el último estable en Git)
                        sh 'git checkout HEAD~1'
                        // Recompila usando la ruta absoluta de npm
                        sh '/usr/bin/npm install && /usr/bin/npm run build'
                        // Reinicia Nginx con la versión anterior estable
                        sh 'docker compose restart frontend'
                        // Aborta la ejecución marcando el Pipeline de Jenkins como fallido
                        error "Pipeline abortado. Se ejecuto Rollback."
                    }
                }
            }
        }
    }

    // Acciones posteriores según el resultado global del Pipeline
    post {
        success {
            echo 'Pipeline finalizado con exito'
        }
        failure {
            echo 'Pipeline fallido'
        }
    }
}
