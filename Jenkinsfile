pipeline {
    agent any

    environment {
        GIT_COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
        IMAGE_NAME = 'bhonebhone/eihu-simple-nodejs-app'
        IMAGE_TAG = "${GIT_COMMIT}"
        FULL_IMAGE = "${IMAGE_NAME}:${IMAGE_TAG}"
        K8S_NAMESPACE = "eihu"
    }
    
     stage('Set Image Tag') {
            steps {
                script {
                    def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.IMAGE_TAG = commit
                    env.FULL_IMAGE = "${IMAGE_NAME}:${commit}"
                }
            }
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

    //     stage('Deploy to Kubernetes') {
    //         steps {
    //             sh '''
    //                 sed -i "s|image:.*|image: $FULL_IMAGE|" k8s/deployment.yaml
    //                 kubectl apply -n $K8S_NAMESPACE -f k8s/deployment.yaml
    //                 kubectl apply -n $K8S_NAMESPACE -f k8s/service.yaml
    //                 kubectl rollout restart deployment/eihu-nodejs-app -n $K8S_NAMESPACE
    //             '''
    //         }
    //     }
    // }
    stage('Update YAML and Push to GitHub (Trigger ArgoCD)') {
            steps {
                withCredentials([string(credentialsId: 'eihudevops', variable: 'EI_TOKEN')]) {
                    sh '''
                        sed -i "s|image:.*|image: $FULL_IMAGE|" k8s/deployment.yaml

                        git config --global user.email "jenkins@ci.local"
                        git config --global user.name "Jenkins CI"

                        git add k8s/deployment.yaml
                        git commit -m "Update image to $FULL_IMAGE" || echo "No changes to commit"
                        git remote set-url origin https://$EI_TOKEN@github.com/einhudevops/Simple_NodeJS_App-main.git
                        git push origin HEAD:main
                    '''
                }
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
