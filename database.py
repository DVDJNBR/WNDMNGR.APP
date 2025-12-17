import os
import streamlit as st
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine, URL

class DatabaseConnection:
    """Gère la connexion à la base de données Supabase PostgreSQL"""

    def __init__(self):
        self.engine = None

    def get_engine(self) -> Engine:
        return self._create_supabase_engine()

    def _create_supabase_engine(self) -> Engine:
        """Crée un engine SQLAlchemy pour Supabase (PostgreSQL)"""
        
        # 1. Récupération des secrets
        if hasattr(st, 'secrets'):
            supabase_url = st.secrets.get('SUPABASE_URL')
            db_password = st.secrets.get('SUPABASE_DB_PASSWORD')
        else:
            # Fallback env vars (pour dev local sans secrets.toml)
            supabase_url = os.getenv('SUPABASE_URL')
            db_password = os.getenv('SUPABASE_DB_PASSWORD')

        if not supabase_url or not db_password:
            raise ValueError(
                "Configuration manquante ! Assurez-vous d'avoir défini 'SUPABASE_URL' "
                "et 'SUPABASE_DB_PASSWORD' dans les secrets Streamlit (.streamlit/secrets.toml)."
            )

        # 2. Parsing de l'URL pour obtenir l'hôte
        try:
            from urllib.parse import urlparse
            parsed = urlparse(supabase_url)
            hostname = parsed.hostname # ex: abcdef.supabase.co
            
            if not hostname:
                raise ValueError("Impossible de lire le hostname depuis SUPABASE_URL")
                
            # L'hôte DB est db.<project_ref>.supabase.co
            host = f"db.{hostname}" if not hostname.startswith("db.") else hostname
            
        except Exception as e:
            raise ValueError(f"Erreur format SUPABASE_URL: {e}")

        # 3. Construction de l'URL de connexion PostgreSQL
        connection_url = URL.create(
            "postgresql+psycopg2",
            username="postgres",
            password=str(db_password),
            host=str(host),
            port=5432,
            database="postgres",
        )

        # 4. Création de l'engine
        engine = create_engine(
            connection_url,
            pool_pre_ping=True
        )
        return engine


@st.cache_resource
def get_database_engine() -> Engine:
    """Retourne un SQLAlchemy engine pour Supabase"""
    db = DatabaseConnection()
    return db.get_engine()


def execute_query(query: str, params: dict = None):
    """Exécute une requête SQL sur Supabase"""
    try:
        engine = get_database_engine()
        with engine.connect() as conn:
            result = conn.execute(text(query), params or {})
            
            if query.strip().upper().startswith('SELECT'):
                rows = result.fetchall()
                return [dict(row._mapping) for row in rows]
            else:
                conn.commit()
                return result.rowcount
    except Exception as e:
        # En prod, eviter d'afficher les details techniques trop bruts si possible,
        # mais utile pour le debug actuel.
        st.error(f"Erreur SQL: {e}")
        return None
