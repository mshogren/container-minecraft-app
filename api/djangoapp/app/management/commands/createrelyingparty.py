import builtins
from django.core.management.base import BaseCommand, CommandError
from oidc_provider.models import Client, ResponseType


class Command(BaseCommand):
    help = "Creates the OIDC relying party, and removes others"

    def handle(self, *args, **options):
        try:
            client = Client(
                name='Some Client', client_id='123', client_secret='456',
                redirect_uris=['http://example.com/'])
            client.save()
            client.response_types.add(ResponseType.objects.get(value='code'))
        except builtins.Exception as exc:
            raise CommandError(exc) from exc

        self.stdout.write(
            self.style.SUCCESS('Created relying party')
        )
