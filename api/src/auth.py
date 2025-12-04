import builtins
import json
from typing import Any, List
from urllib.error import HTTPError
from urllib.parse import urljoin
from urllib.request import urlopen

import strawberry
from jose import exceptions, jwt
from strawberry.types import Info

from .settings import Settings


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token(auth: str | None) -> str:
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    if len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    if len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)
    return parts[1]


def get_openid_configuration(authority: str) -> Any:
    uri = urljoin(authority, ".well-known/openid-configuration")
    with urlopen(uri) as response:
        try:
            return json.loads(response.read())
        except HTTPError as error:
            raise builtins.Exception(
                "OpenID Configuration could not be retrieved") from error


def get_keys(jwks_uri: str) -> List:
    with urlopen(jwks_uri) as response:
        try:
            data = json.loads(response.read())
            return data["keys"]
        except HTTPError as error:
            raise builtins.Exception(
                "JWKS could not be retrieved") from error


def select_key(keys: List, kid: str) -> dict[str, str]:
    return next(key for key in keys if key["kid"] == kid)


def get_payload(token: str, authority: str, audience: str) -> Any:
    jwks_uri = get_openid_configuration(authority)["jwks_uri"]
    keys = get_keys(jwks_uri)
    unverified_header = jwt.get_unverified_header(token)
    key = select_key(keys, unverified_header["kid"])
    try:
        return jwt.decode(
            token,
            key,
            audience=audience,
            issuer=authority,
            options={"verify_at_hash": False}
        )
    except exceptions.ExpiredSignatureError as ex:
        raise AuthError(
            {"code": "token_expired",
             "description": "token is expired"},
            401) from ex
    except exceptions.JWTClaimsError as ex:
        raise AuthError(
            {"code": "invalid_claims",
             "description":
             "incorrect claims,"
             "please check the audience and issuer"},
            401) from ex
    except Exception as ex:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Unable to parse authentication"
                            " token."}, 401) from ex


class IsPermitted(strawberry.BasePermission):
    # pylint: disable=too-few-public-methods
    message = "User is not authenticated"

    def has_permission(self, source: Any, info: Info, **kwargs) -> bool:
        if Settings().authority:
            token = get_token(info.context.request)
            get_payload(token, Settings().authority,
                        Settings().client_id)
        return True
