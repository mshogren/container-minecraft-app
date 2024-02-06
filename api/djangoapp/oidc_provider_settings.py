def userinfo(claims, user):
    claims['name'] = f'{user.first_name} {user.last_name}'
    claims['given_name'] = user.first_name
    claims['family_name'] = user.last_name
    claims['email'] = user.email
    claims['profile'] = user.player.minecraft_username
    return claims
