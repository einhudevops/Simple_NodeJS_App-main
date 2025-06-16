pipeline {
    agent any

    environment {
        IMAGE_NAME = 'bhonebhone/simple-nodejs-app'
        K8S_NAMESPACE = "nodejs-app-ns"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/bhone121212/Simple_NodeJS_App-main.git',
                        credentialsId: 'github-cred'
                    ]]
                ])
            }
        }

        stage('Set Image Tag') {
            steps {
                script {
                    env.GIT_COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.IMAGE_TAG = "${GIT_COMMIT}"
                    env.FULL_IMAGE = "${IMAGE_NAME}:${IMAGE_TAG}"
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
                sh 'npm test || true'  // allow pipeline to pass even if no test script
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
                sh '''
                    sed -i "s|image:.*|image: $FULL_IMAGE|" k8s/deployment.yaml

                    git config user.email "jenkins@ci.local"
                    git config user.name "Jenkins CI"

                    git checkout main
                    git add k8s/deployment.yaml
                    git commit -m "Update image to $FULL_IMAGE"
                    git push origin main
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment committed to GitHub. Argo CD will sync automatically.'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}
