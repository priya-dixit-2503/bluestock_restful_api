from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    RegisterView,
    CompanyViewSet,
    IPOViewSet,
    DocumentViewSet,
    LoginView,
    LogoutView,
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

app_name = 'api'

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'ipos', IPOViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('ipo/<int:pk>/', views.ipo_detail),
    path('ipo/', views.ipo_list),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('ipo/paginated/', views.ipo_list, name='ipo-paginated'),



    
]
