pipeline {
    agent any

    stages {
        stage('Check K8s Connection') {
            steps {
                sh 'kubectl get nodes'
            }
        }

        stage('Check K8s Pods') {
            steps {
                sh 'kubectl get pods'
            }
        }

        stage('Install Node.js Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
    }

    post {
        success { echo '✅ Build and test succeeded.' }
        failure { echo '❌ Build or test failed.' }
    }
}

