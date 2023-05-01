from typing import Optional

from pydantic import BaseSettings


class SchemaLabels:
    # pylint: disable=too-few-public-methods, line-too-long
    SERVERERROR_TYPE_NAME = "ServerError"
    SERVERERROR_TYPE_DESCRIPTION = "A type that encapsulates error information returned by the Server mutation"
    SERVERERROR_ERROR_FIELD_NAME = "error"
    SERVERERROR_ERROR_FIELD_DESCRIPTION = "An error return by the Server mutation"
    ADDCURSEFORGESERVERINPUT_TYPE_NAME = "AddCurseforgeServerInput"
    ADDCURSEFORGESERVERINPUT_TYPE_DESCRIPTION = "A type that encapsulates the information required by the addCurseforgeServer mutation"
    ADDCURSEFORGESERVERINPUT_NAME_FIELD_NAME = "name"
    ADDCURSEFORGESERVERINPUT_NAME_FIELD_DESCRIPTION = "The name of the Minecraft Server to be added"
    ADDCURSEFORGESERVERINPUT_MODPACKID_FIELD_NAME = "modpackId"
    ADDCURSEFORGESERVERINPUT_MODPACKID_FIELD_DESCRIPTION = "The modpack id"
    ADDVANILLASERVERINPUT_TYPE_NAME = "AddVanillaServerInput"
    ADDVANILLASERVERINPUT_TYPE_DESCRIPTION = "A type that encapsulates the information required by the addVanillaServer mutation"
    ADDVANILLASERVERINPUT_NAME_FIELD_NAME = "name"
    ADDVANILLASERVERINPUT_NAME_FIELD_DESCRIPTION = "The name of the Minecraft Server to be added"
    ADDVANILLASERVERINPUT_VERSION_FIELD_NAME = "version"
    ADDVANILLASERVERINPUT_VERSION_FIELD_DESCRIPTION = "The version of the Minecraft Server to be added"
    SERVERRESPONSE_TYPE_NAME = "ServerResponse"
    SERVERRESPONSE_TYPE_DESCRIPTION = "A union type used for returning the result of the Server mutation"
    SERVERSUCCESS_TYPE_NAME = "ServerSuccess"
    SERVERSUCCESS_TYPE_DESCRIPTION = "A type that encapsulates the information returned by successful Server mutation"
    SERVERSUCCESS_SERVER_FIELD_NAME = "server"
    SERVERSUCCESS_SERVER_FIELD_DESCRIPTION = "The details of the Minecraft server added by the Server mutation"
    IMAGE_TYPE_NAME = "Image"
    IMAGE_TYPE_DESCRIPTION = "The container image used by a Minecraft server"
    IMAGE_NAME_FIELD_NAME = "name"
    IMAGE_NAME_FIELD_DESCRIPTION = "The name of the container image"
    IMAGE_TAG_FIELD_NAME = "tag"
    IMAGE_TAG_FIELD_DESCRIPTION = "The tag of the container image"
    MODPACK_TYPE_NAME = "Modpack"
    MODPACK_TYPE_DESCRIPTION = "A modpack to be installed in a Minecraft server"
    MODPACK_CATEGORIES_FIELD_NAME = "categories"
    MODPACK_CATEGORIES_FIELD_DESCRIPTION = "A collection of categories that this modpack is tagged with"
    MODPACK_DEFAULT_FILE_ID_FIELD_NAME = "defaultFileId"
    MODPACK_DEFAULT_FILE_ID_FIELD_DESCRIPTION = "The id of the default file for this modpack to be installed by a Minecraft client user"
    MODPACK_DOWNLOADCOUNT_FIELD_NAME = "downloadCount"
    MODPACK_DOWNLOADCOUNT_FIELD_DESCRIPTION = "The number of times this modpack has been downloaded"
    MODPACK_ID_FIELD_NAME = "id"
    MODPACK_ID_FIELD_DESCRIPTION = "The modpack id"
    MODPACK_NAME_FIELD_NAME = "name"
    MODPACK_NAME_FIELD_DESCRIPTION = "The name of the modpack"
    MODPACK_SUMMARY_FIELD_NAME = "summary"
    MODPACK_SUMMARY_FIELD_DESCRIPTION = "A summary description of the modpack"
    MODPACK_THUMBNAILURL_FIELD_NAME = "thumbnailUrl"
    MODPACK_THUMBNAILURL_FIELD_DESCRIPTION = "The URL of an image thumbnail representing the modpack"
    MODPACK_VERSION_FIELD_NAME = "version"
    MODPACK_VERSION_FIELD_DESCRIPTION = "The Minecraft game version this modpack is intended to be used with"
    MODPACK_WEBSITEURL_FIELD_NAME = "websiteUrl"
    MODPACK_WEBSITEURL_FIELD_DESCRIPTION = "The URL containing the full information about this modpack"
    MUTATION_TYPE_NAME = "Mutation"
    MUTATION_TYPE_DESCRIPTION = "The collection of possible mutations"
    MUTATION_ADDCURSEFORGESERVER_FIELD_NAME = "addCurseforgeServer"
    MUTATION_ADDCURSEFORGESERVER_FIELD_DESCRIPTION = "The mutation used to add a Minecraft server"
    MUTATION_ADDCURSEFORGESERVER_ARG_NAME = "server"
    MUTATION_ADDCURSEFORGESERVER_ARG_DESCRIPTION = "The AddCurseforgeServerInput used to add a Minecraft server"
    MUTATION_ADDVANILLASERVER_FIELD_NAME = "addVanillaServer"
    MUTATION_ADDVANILLASERVER_FIELD_DESCRIPTION = "The mutation used to add a Minecraft server"
    MUTATION_ADDVANILLASERVER_ARG_NAME = "server"
    MUTATION_ADDVANILLASERVER_ARG_DESCRIPTION = "The AddVanillaServerInput used to add a Minecraft server"
    MUTATION_STARTSERVER_FIELD_NAME = "startServer"
    MUTATION_STARTSERVER_FIELD_DESCRIPTION = "The mutation used to start an existing Minecraft server"
    MUTATION_STARTSERVER_ARG_NAME = "serverId"
    MUTATION_STARTSERVER_ARG_DESCRIPTION = "The id of the Minecraft server to start"
    MUTATION_STOPSERVER_FIELD_NAME = "stopServer"
    MUTATION_STOPSERVER_FIELD_DESCRIPTION = "The mutation used to stop an existing Minecraft server"
    MUTATION_STOPSERVER_ARG_NAME = "serverId"
    MUTATION_STOPSERVER_ARG_DESCRIPTION = "The id of the Minecraft server to stop"
    PORT_TYPE_NAME = "Port"
    PORT_TYPE_DESCRIPTION = "A port published by a Minecraft server container"
    PORT_PORT_FIELD_NAME = "port"
    PORT_PORT_FIELD_DESCRIPTION = "The port exposed by a Minecraft server container"
    PORT_HOSTPORT_FIELD_NAME = "hostPort"
    PORT_HOSTPORT_FIELD_DESCRIPTION = "The port on the host an exposed port is mapped to"
    QUERY_TYPE_NAME = "Query"
    QUERY_TYPE_DESCRIPTION = "The collection of possible queries"
    QUERY_MODPACK_FIELD_NAME = "modpack"
    QUERY_MODPACK_FIELD_DESCRIPTION = "A query for a single modpack"
    QUERY_MODPACK_MODPACKID_ARG_NAME = "modpackId"
    QUERY_MODPACK_MODPACKID_ARG_DESCRIPTION = "the id of the modpack to retrieve"
    QUERY_MODPACKS_FIELD_NAME = "modpacks"
    QUERY_MODPACKS_FIELD_DESCRIPTION = "A query for a collection of modpacks"
    QUERY_MODPACKS_PAGE_ARG_NAME = "page"
    QUERY_MODPACKS_PAGE_ARG_DESCRIPTION = "The number of the results page, starting at 0"
    QUERY_MODPACKS_SEARCH_ARG_NAME = "search"
    QUERY_MODPACKS_SEARCH_ARG_DESCRIPTION = "Text to search for in the modpack names and descriptions"
    QUERY_SERVER_FIELD_NAME = "server"
    QUERY_SERVER_FIELD_DESCRIPTION = "A query for a single Minecraft server"
    QUERY_SERVER_SERVERID_ARG_NAME = "serverId"
    QUERY_SERVER_SERVERID_ARG_DESCRIPTION = "The id of the Minecraft server to retrieve"
    QUERY_SERVERS_FIELD_NAME = "servers"
    QUERY_SERVERS_FIELD_DESCRIPTION = "A query for a collection of Minecraft servers"
    QUERY_VERSIONS_FIELD_NAME = "versions"
    QUERY_VERSIONS_FIELD_DESCRIPTION = "A query for a collection of Mincraft game versions"
    SERVER_TYPE_NAME = "Server"
    SERVER_TYPE_DESCRIPTION = "A Minecraft server container"
    SERVER_CREATED_FIELD_NAME = "created"
    SERVER_CREATED_FIELD_DESCRIPTION = "The date/time the server container was created"
    SERVER_GAMEVERSION_FIELD_NAME = "gameVersion"
    SERVER_GAMEVERSION_FIELD_DESCRIPTION = "The Minecraft game version that the server container is running"
    SERVER_ID_FIELD_NAME = "id"
    SERVER_ID_FIELD_DESCRIPTION = "The id of the server container"
    SERVER_IMAGE_FIELD_NAME = "image"
    SERVER_IMAGE_FIELD_DESCRIPTION = "The image used by the server container"
    SERVER_NAME_FIELD_NAME = "name"
    SERVER_NAME_FIELD_DESCRIPTION = "The name of the server container"
    SERVER_PORTS_FIELD_NAME = "ports"
    SERVER_PORTS_FIELD_DESCRIPTION = "A collections of ports published by the server container"
    SERVER_STARTED_FIELD_NAME = "started"
    SERVER_STARTED_FIELD_DESCRIPTION = "The date/time the server container was last started"
    SERVER_STATUS_FIELD_NAME = "status"
    SERVER_STATUS_FIELD_DESCRIPTION = "The status of the server container"
    SERVER_TYPE_FIELD_NAME = "type"
    SERVER_TYPE_FIELD_DESCRIPTION = "The type of Minecraft game the the server container is running"
    SERVER_VOLUMES_FIELD_NAME = "volumes"
    SERVER_VOLUMES_FIELD_DESCRIPTION = "A collection of volumes bound to the server container"
    TYPE_ENUM_NAME = "TypeEnum"
    TYPE_ENUM_DESCRIPTION = "An enumeration of the possible Minecraft game types"
    TYPE_ENUM_CURSEFORGE_DESCRIPTION = "A Minecraft game running with a CurseForge Modpack"
    TYPE_ENUM_FABRIC_DESCRIPTION = "A Minecraft game running with the Fabric loader"
    TYPE_ENUM_FORGE_DESCRIPTION = "A Minecraft game running with the Forge loader"
    TYPE_ENUM_VANILLA_DESCRIPTION = "A vanilla Minecraft game"
    VERSION_TYPE_NAME = "Version"
    VERSION_TYPE_DESCRIPTION = "A type that encapsulates the information about a Minecraft game version"
    VERSION_VERSION_FIELD_NAME = "version"
    VERSION_VERSION_FIELD_DESCRIPTION = "A Minecraft game version"
    VOLUME_TYPE_NAME = "Volume"
    VOLUME_TYPE_DESCRIPTION = "A type that encapsulates the information about a volume bound to a Minecraft server container"
    VOLUME_NAME_FIELD_NAME = "name"
    VOLUME_NAME_FIELD_DESCRIPTION = "The name of the volume"
    VOLUME_SOURCE_FIELD_NAME = "source"
    VOLUME_SOURCE_FIELD_DESCRIPTION = "The path of the volume on the host"


class Settings(BaseSettings):
    # pylint: disable=too-few-public-methods
    default_image: str = "itzg/minecraft-server"
    allowed_origin: Optional[str] = None
    curseforge_api_key: str = ""
