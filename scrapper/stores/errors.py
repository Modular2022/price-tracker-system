# Comment here
class Error:
    def __init__(self, error_name, details):
        self._error_name = error_name
        self._details = details

    def __str__(self):
        return f'{self._name} {self._details}'

# Comment here
class TokenExpiredError(Error):
    def __init__(self, details):
        super().__init__('Token expired:  ', details)

# Comment here
class SequelizeUniqueConstraintError(Error):
    def __init__(self, details):
        super().__init__('Duplicate product: ', details)

# Comment here
class UnkownError(Error):
    def __init__(self, details):
        super().__init__('Unkown error: ', details)