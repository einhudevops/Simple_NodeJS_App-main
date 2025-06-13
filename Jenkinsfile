// pipeline {
// 	agent any
// 	tools {
// 		nodejs 'NodeJS'
// 	}
// 	environment {
// 		SONAR_PROJECT_KEY = 'node'
// 		SONAR_SCANNER_HOME = tool 'SonarQubeScanner'
// 	}

// 	stages {
// 		stage('Checkout Github'){
// 			steps {
// 				git branch: 'main', credentialsId: 'github-cred', url: 'https://github.com/iQuantC/Simple_NodeJS_App.git'
// 			}
// 		}
		
// 		stage('Install node dependencies'){
// 			steps {
// 				sh 'npm install'
// 			}
// 		}
// 		stage('Tests'){
// 			steps {
// 				sh 'npm test'
// 			}
// 		}
// 		stage('SonarQube Analysis'){
// 			steps {
// 				withCredentials([string(credentialsId: 'node-token', variable: 'SONAR_TOKEN')]) {
				   
// 					withSonarQubeEnv('SonarQube') {
// 						sh """
//                   				${SONAR_SCANNER_HOME}/bin/sonar-scanner \
//                   				-Dsonar.projectKey=${SONAR_PROJECT_KEY} \
//                     				-Dsonar.sources=. \
//                    				-Dsonar.host.url=http://192.168.1.128:9000 \
//                     				-Dsonar.login=${SONAR_TOKEN}
//                     				"""
// 					}	
// 				}
// 			}
// 		}
// 	}
// 	post {
// 		success {
// 			echo 'Build completed succesfully!'
// 		}
// 		failure {
// 			echo 'Build failed. Check logs.'
// 		}
// 	}
// }
pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Check K8s Connection') {
            steps {
                echo 'Checking Kubernetes cluster access...'
                sh 'kubectl get nodes'
            }
        }

        stage('Install Node.js Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running unit tests...'
                sh 'npm test'
            }
        }
    }

    post {
        success {
            echo '✅ Build and tests succeeded.'
        }
        failure {
            echo '❌ Build or tests failed.'
        }
    }
}


