from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests


# Create your views here.

class RegisterView(APIView):
    def post(self,request):
        email = request.data.get("email")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        password = request.data.get("password") 

        if not all([email,first_name,last_name,password]):
            return Response({'error':"All fields are required"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=email).exists():
            return Response({'error':'The User already exixts'}, status=status.HTTP_400_BAD_REQUEST)
        user=User.objects.create_user(username=email,email=email,first_name=first_name,last_name=last_name,password=password)
        return Response({'message':"User created successfully"},status=status.HTTP_201_CREATED) 

    def post(self,request):
        email=request.data.get("email")
        password=request.data.get("password")

        if not email or not password:
            return Response({"error":"Email and password required"},status=status.HTTP_400_BAD_REQUEST)
        
        user=authenticate(username=email,password=password)

        if not user:
            return Response({"error":"Invalid Credentials"},status=status.HTTP_401_UNAUTHORIZED)
        
        refresh=RefreshToken.for_user(user)
        return Response({"access":str(refresh.access_token), "refresh":str(refresh), "username":user.username})

class GoogleAuthView(APIView):
    def post(self, request):
        token = request.data.get("token")

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                "994477686925-dvs2o1p2v5besv1nsf2cg5rga6p7j14u.apps.googleusercontent.com"
            )
        except ValueError:
            return Response({"error": "Invalid token"}, status=400)

        email = idinfo["email"]
        name = idinfo.get("name", "")

        user, created = User.objects.get_or_create(
            username=email,
            defaults={"email": email, "first_name": name}
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "is_new_user": created
        })
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })