pipeline {
    agent any

    environment {
        GIT_COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
        IMAGE_NAME = 'bhonebhone/eihu-simple-nodejs-app'
        IMAGE_TAG = "${GIT_COMMIT}"
        FULL_IMAGE = "${IMAGE_NAME}:${IMAGE_TAG}"
        K8S_NAMESPACE = "eihu"
    }

    stages {
        stage('Check K8s Connection') {
            steps {
                sh 'kubectl get nodes'
            }
        }

        stage('Ensure Namespace Exists') {
            steps {
                sh '''
                    kubectl get namespace $K8S_NAMESPACE || kubectl create namespace $K8S_NAMESPACE
                '''
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
                    kubectl apply -n $K8S_NAMESPACE -f k8s/deployment.yaml
                    kubectl apply -n $K8S_NAMESPACE -f k8s/service.yaml
                    kubectl rollout restart deployment/eihu-nodejs-app -n $K8S_NAMESPACE
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployed to Kubernetes namespace successfully.'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
