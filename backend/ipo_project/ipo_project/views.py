from django.shortcuts import render, redirect
from rest_framework import generics, status, viewsets
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from django.views.generic import RedirectView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.pagination import PageNumberPagination



from .serializers import (
    RegisterSerializer,
    CompanySerializer,
    IPOSerializer,
    DocumentSerializer,
    LoginSerializer
)
from .models import Company, IPO, Document

import logging

logger = logging.getLogger()


class HomeView(RedirectView):
    pattern_name = 'api:register'
    permanent = False


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": serializer.data,
                "message": "User created successfully"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_serializer(self, *args, **kwargs):
        return LoginSerializer(*args, **kwargs)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(username=username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    }
                })

            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        except TokenError:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def ipos(self, request, pk=None):
        company = self.get_object()
        ipos = company.ipos.all()
        serializer = IPOSerializer(ipos, many=True)
        return Response(serializer.data)


class IPOViewSet(viewsets.ModelViewSet):
    queryset = IPO.objects.all()
    serializer_class = IPOSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = IPO.objects.all()
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET', 'PUT', 'DELETE'])
def ipo_detail(request, pk):
    try:
        queryset = IPO.objects.get(pk=pk)
        serializer_class = IPOSerializer
        permission_classes = [IsAuthenticated]
    except IPO.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        logger.info(f"Called GET API for id", exc_info=True)
        serializer = IPOSerializer(queryset)
        return Response(serializer.data)

    elif request.method == 'PUT':
        logger.info(f"Called PUT API for id", exc_info=True)
        serializer = IPOSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        logger.info(f"Called DELETE API for id", exc_info=True)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def ipo_list(request):
    if request.method == 'GET':
        logger.info("Called GET API list")
        try:
            ipo = Company.objects.all()
            paginator = PageNumberPagination()
            paginator.page_size = 5  # Adjust as needed
            result_page = paginator.paginate_queryset(ipo, request)
            serializer = CompanySerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            logger.error(f"Error in GET API LIST: {e}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'POST':
        logger.info("Called POST API list", exc_info=True)
        try:
            serializer = CompanySerializer(data=request.data)
            permission_classes = [IsAuthenticated]
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error in POST API LIST: {e}", exc_info=True)
            return Response({'error': 'Something went wrong while saving data.', 'details': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
