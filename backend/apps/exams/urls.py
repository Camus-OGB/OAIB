"""URL patterns pour l'app exams."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'editions', views.EditionViewSet, basename='editions')
router.register(r'phases', views.PhaseViewSet, basename='phases')
router.register(r'categories', views.QuestionCategoryViewSet, basename='question-categories')
router.register(r'questions', views.QuestionViewSet, basename='questions')
router.register(r'exams', views.ExamViewSet, basename='exams')
router.register(r'sessions/admin', views.ExamSessionAdminViewSet, basename='sessions-admin')

urlpatterns = [
    # Candidat — sessions d'examen
    path('start/<int:exam_id>/', views.StartExamView.as_view(), name='start-exam'),
    path('session/<int:session_id>/answer/', views.SubmitAnswerView.as_view(), name='submit-answer'),
    path('session/<int:session_id>/finish/', views.FinishExamView.as_view(), name='finish-exam'),
    path('my-sessions/', views.MyExamSessionsView.as_view(), name='my-sessions'),

    # Router
    path('', include(router.urls)),
]
