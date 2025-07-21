# Custom exception for duplicate values
class DuplicateValueException(Exception):
    def __init__(self, message="Duplicate value found"):
        super().__init__(message)
