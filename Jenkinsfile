pipeline {
  agent any

  environment {
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build backend image') {
      steps {
        sh 'docker build -t ecommerce-backend:${IMAGE_TAG} ./backend'
      }
    }

    stage('Build frontend image') {
      steps {
        sh 'docker build -t ecommerce-frontend:${IMAGE_TAG} --build-arg VITE_API_URL=http://localhost:5000/api/v1 ./frontend'
      }
    }
  }

  post {
    always {
      sh 'docker images | grep ecommerce | head -5'
    }
  }
}
