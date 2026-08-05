from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import os

try:
    import google.generativeai as genai
except ImportError:
    genai = None

class AIAssistView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not genai:
            return Response(
                {'error': 'google-generativeai is not installed'},
                status=status.HTTP_501_NOT_IMPLEMENTED
            )

        from decouple import config
        api_key = config('GEMINI_API_KEY', default='')
        if not api_key:
            return Response(
                {'error': 'GEMINI_API_KEY is not configured. Please add it to your .env file to enable AI assistance.'},
                status=status.HTTP_501_NOT_IMPLEMENTED
            )

        prompt = request.data.get('prompt')
        text = request.data.get('text', '')

        if not prompt:
            return Response({'error': 'prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            full_prompt = f"{prompt}\n\nContext text:\n{text}" if text else prompt
            
            response = model.generate_content(full_prompt)
            
            return Response({'result': response.text})
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
