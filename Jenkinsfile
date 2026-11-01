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

    stage('SonarQube analysis') {
      steps {
        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
          sh '''
            docker run --rm \
              --network devops-net \
              --volumes-from jenkins-local \
              -w "$WORKSPACE" \
              -e SONAR_HOST_URL=http://sonarqube:9000 \
              -e SONAR_TOKEN \
              sonarsource/sonar-scanner-cli \
              -Dsonar.projectKey=ecommerce \
              -Dsonar.sources=backend/src,frontend \
              -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/*.backup \
              -Dsonar.qualitygate.wait=true
          '''
        }
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

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                          usernameVariable: 'DH_USER',
                                          passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            for img in backend frontend; do
              docker tag ecommerce-$img:${IMAGE_TAG} $DH_USER/ecommerce-$img:${IMAGE_TAG}
              docker tag ecommerce-$img:${IMAGE_TAG} $DH_USER/ecommerce-$img:latest
              docker push $DH_USER/ecommerce-$img:${IMAGE_TAG}
              docker push $DH_USER/ecommerce-$img:latest
            done
            docker logout
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker images | grep ecommerce | head -6'
    }
  }
}
