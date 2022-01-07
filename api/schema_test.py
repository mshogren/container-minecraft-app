from schema import schema


class TestSchema:
    @staticmethod
    def test_schema_types():
        query = """
            query Types {
                __schema {
                    types {
                        name
                    }
                }
            }
        """

        actual = schema.execute_sync(query)
        assert actual.errors is None

        expected = ['Modpack', 'Server']
        type_names = [x["name"] for x in actual.data["__schema"]["types"]]
        assert len(list(set(type_names).intersection(expected))
                   ) == len(expected)

    @staticmethod
    def test_schema_query_fields():
        query = """
            query QueryFields {
                __type(name: "Query") {
                    name
                    fields {
                        name
                        type {
                            name
                            kind
                            ofType {
                                name
                                kind
                            }
                        }
                    }
                }
            }
        """

        actual = schema.execute_sync(query)
        assert actual.errors is None

        expected = ['modpack', 'modpacks', 'server', 'servers', 'versions']
        field_names = [x["name"] for x in actual.data["__type"]["fields"]]
        assert len(list(set(field_names).intersection(expected))
                   ) == len(expected)
