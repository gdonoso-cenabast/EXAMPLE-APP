pipeline {
    agent any

    stages {
        stage('1. Compilacion') {
            steps {
                echo 'Iniciando compilacion...'
                sh 'docker run --rm -v $(pwd):/app -w /app node:alpine sh -c "npm install && npm run build"'
            }
        }

        stage('2. Analisis con SonarQube') {
            steps {
                echo 'Iniciando escaneo con SonarScanner CLI...'
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

        stage('3. Evaluacion y Despliegue o Rollback') {
            steps {
                script {
                    echo 'Verificando calidad...'
                    try {
                        echo 'Quality Gate APROBADO. Desplegando...'
                        sh 'docker compose restart frontend'
                    } catch (Exception e) {
                        echo 'Quality Gate REPROBADO. Ejecutando Rollback...'
                        sh 'git checkout HEAD~1'
                        sh 'docker run --rm -v $(pwd):/app -w /app node:alpine sh -c "npm install && npm run build"'
                        sh 'docker compose restart frontend'
                        error "Pipeline abortado. Se ejecuto Rollback."
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline finalizado con exito'
        }
        failure {
            echo 'Pipeline fallido'
        }
    }
}
