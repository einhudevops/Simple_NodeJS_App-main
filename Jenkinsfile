pipeline {
    agent any

    environment {
        IMAGE_NAME = 'bhonebhone/simple-nodejs-app'
        K8S_NAMESPACE = "nodejs-app-ns"
    }

    stages {
        stage('Set Image Tag') {
            steps {
                script {
                    env.GIT_COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.IMAGE_TAG = "${env.GIT_COMMIT}"
                    env.FULL_IMAGE = "${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                }
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

        stage('Build & Push Docker Image') {
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

        stage('Update Deployment YAML and Push to GitHub') {
            steps {
                sh '''
                    sed -i "s|image:.*|image: $FULL_IMAGE|" k8s/deployment.yaml

                    git config user.email "jenkins@ci.local"
                    git config user.name "Jenkins CI"
                    git add k8s/deployment.yaml
                    git commit -m "Update image to $FULL_IMAGE"
                    git push origin main
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Image built, pushed, and GitHub updated. Argo CD will sync automatically.'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}
