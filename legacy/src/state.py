from typing import List, Dict, Optional

class AppState:
    """
    Singleton class to manage application state, mirroring Taipy's state
    but accessible for testing and logic outside the GUI context.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AppState, cls).__new__(cls)
            cls._instance.initialized = False
            cls._instance._initialize_defaults()
        return cls._instance
    
    def _initialize_defaults(self):
        self.authenticated: bool = False
        self.user_email: str = ""
        self.user_role: str = ""
        self.selected_farm_uuid: Optional[str] = None
        self.farms_list: List[Dict] = []
        self.current_farm_data: Dict = {}
        self.message: str = ""
        self.message_type: str = "info"
        self.initialized = True

    def set_user(self, email: str, role: str):
        self.authenticated = True
        self.user_email = email
        self.user_role = role

    def logout(self):
        self.authenticated = False
        self.user_email = ""
        self.user_role = ""

    def clear(self):
        self._initialize_defaults()

def get_state() -> AppState:
    """Returns the singleton instance of AppState."""
    return AppState()

def reset_state() -> AppState:
    """Resets the singleton instance to defaults."""
    state = get_state()
    state.clear()
    return state
