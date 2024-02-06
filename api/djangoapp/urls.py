"""
URL configuration for djangoapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from typing import Any
from django.contrib import admin
from django.http import HttpRequest, JsonResponse
from django.http.response import HttpResponse
from django.shortcuts import render
from django.urls import include, path, re_path
from oidc_provider.models import Client
from strawberry.django.views import GraphQLView
from src.auth import get_payload, get_token
from src.schema import schema
from src.server.docker_server import DockerServer
from src.server.kube_server import KubernetesServer
from src.settings import Settings


import logging

logger = logging.getLogger(__name__)


class MyGraphQLView(GraphQLView):
    def get_context(self, request: HttpRequest, response: HttpResponse) -> Any:
        context = super().get_context(request, response)
        user = None
        token = get_token(request.headers.get('Authorization', None))
        user = get_payload(token, Settings().authority,
                           Settings().client_id)
        # logger.warning(token)
        is_kubernetes = bool(Settings().kubernetes_service_host)
        context.server_helper = KubernetesServer(
            user) if is_kubernetes else DockerServer(user)
        return context


def render_spa(request):
    return render(request, "index.html")


def render_config(request):
    data = {'authority': '', 'client_id': ''}
    client = Client.objects.first()
    if client:
        data['authority'] = request.build_absolute_uri('/openid/')
        data['client_id'] = client.client_id
    return JsonResponse(data)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('openid/', include('oidc_provider.urls', namespace='oidc_provider')),
    path('graphql', MyGraphQLView.as_view(schema=schema)),
    path('config.js', render_config),
    re_path(r"^$", render_spa),
    re_path(r"^(?:.*)/?$", render_spa),
]
