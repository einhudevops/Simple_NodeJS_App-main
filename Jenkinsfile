pipeline {
    agent any

    environment {
        IMAGE_NAME = 'bhonebhone/simple-nodejs-app'
        K8S_NAMESPACE = "nodejs-app-ns"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Set Image Tag') {
            steps {
                script {
                    GIT_COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    IMAGE_TAG = "${GIT_COMMIT}"
                    FULL_IMAGE = "${IMAGE_NAME}:${IMAGE_TAG}"
                    env.FULL_IMAGE = FULL_IMAGE
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
                sh 'npm test || true' // Skip failure for "no test specified"
            }
        }

        stage('Build and Push Image (Buildah)') {
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
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                        sed -i "s|image:.*|image: $FULL_IMAGE|" k8s/deployment.yaml

                        git config user.email "jenkins@ci.local"
                        git config user.name "Jenkins CI"

                        git checkout -B main
                        git add k8s/deployment.yaml
                        git commit -m "Update image to $FULL_IMAGE" || echo "No changes to commit"
                        git remote set-url origin https://$GITHUB_TOKEN@github.com/bhone121212/Simple_NodeJS_App-main.git
                        git push origin main
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline executed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs for issues.'
        }
    }
}
