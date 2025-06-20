pipeline {
    agent any

    environment {
        IMAGE_NAME = 'bhonebhone/eihu-simple-nodejs-app'
        K8S_NAMESPACE = "eihu"
    }

    stages {
        stage('Set Image Tag') {
            steps {
                script {
                    def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.IMAGE_TAG = commit
                    env.FULL_IMAGE = "${IMAGE_NAME}:${commit}"
                }
            }
        }

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

        stage('Update YAML and Push to GitHub (Trigger ArgoCD)') {
        steps {
            withCredentials([usernamePassword(credentialsId: 'eihudevops', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                sh '''
                    # Replace image tag in deployment.yaml
                    sed -i "s|image:.*|image: $FULL_IMAGE|" k8s/deployment.yaml
    
                    # Configure Git identity
                    git config --global user.email "jenkins@ci.local"
                    git config --global user.name "Jenkins CI"
    
                    # Commit and push the update
                    git add k8s/deployment.yaml
                    git commit -m "Update image to $FULL_IMAGE" || echo "No changes to commit"
                    git remote set-url origin https://$GIT_USER:$GIT_TOKEN@github.com/einhudevops/Simple_NodeJS_App-main.git
                    git push origin HEAD:main
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Python Application Deployed to Kubernetes namespace successfully.'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
