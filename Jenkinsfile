pipeline {
    agent any

    environment {
        IMAGE_NAME = 'bhonebhone/simple-nodejs-app'
        IMAGE_TAG = "latest"
        FULL_IMAGE = "${IMAGE_NAME}:${IMAGE_TAG}"
    }

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

        stage('Build and Push Image (Buildah with sudo)') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
                    sh '''
                        echo "$REG_PASS" | sudo -S buildah login -u "$REG_USER" --password-stdin docker.io
                        sudo buildah bud -t $FULL_IMAGE .
                        sudo buildah push $FULL_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    sed -i "s|image:.*|image: $FULL_IMAGE|" k8s/deployment.yaml
                    kubectl apply -f k8s/deployment.yaml
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Buildah image built, pushed, and deployed to Kubernetes.'
        }
        failure {
            echo '❌ Something failed during the pipeline.'
        }
    }
}
