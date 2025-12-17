import os
import socket
import streamlit as st
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine, URL

class DatabaseConnection:
    """Gère la connexion à la base de données Supabase PostgreSQL"""

    def __init__(self):
        self.engine = None

    def get_engine(self) -> Engine:
        return self._create_supabase_engine()

    def _resolve_ipv4(self, hostname: str) -> str:
        """Résout un nom d'hôte en adresse IPv4 pour éviter les erreurs IPv6"""
        try:
            # getaddrinfo avec AF_INET force la recherche d'adresses IPv4
            addr_info = socket.getaddrinfo(hostname, 5432, socket.AF_INET)
            # On prend la première IP trouvée (format: (family, type, proto, canonname, sockaddr))
            # sockaddr est un tuple (ip, port)
            ipv4_address = addr_info[0][4][0]
            print(f"DNS Resolved: {hostname} -> {ipv4_address}")
            return ipv4_address
        except Exception as e:
            st.warning(f"Impossible de résoudre l'IPv4 pour {hostname}: {e}")
            return hostname # Fallback sur le nom d'hôte

    def _create_supabase_engine(self) -> Engine:
        """Crée un engine SQLAlchemy pour Supabase (PostgreSQL)"""
        
        # 1. Récupération des secrets
        if hasattr(st, 'secrets'):
            supabase_url = st.secrets.get('SUPABASE_URL')
            db_password = st.secrets.get('SUPABASE_DB_PASSWORD')
        else:
            supabase_url = os.getenv('SUPABASE_URL')
            db_password = os.getenv('SUPABASE_DB_PASSWORD')

        if not supabase_url or not db_password:
            raise ValueError("Configuration manquante (SUPABASE_URL, SUPABASE_DB_PASSWORD)")

        # 2. Extraction Host
        try:
            from urllib.parse import urlparse
            parsed = urlparse(supabase_url)
            hostname = parsed.hostname
            
            if not hostname:
                raise ValueError("Impossible de lire le hostname")
            
            # Hostname théorique Supabase
            db_hostname = f"db.{hostname}" if not hostname.startswith("db.") else hostname
            
            # FORCE IPV4 RESOLUTION
            host = self._resolve_ipv4(db_hostname)
            
        except Exception as e:
            raise ValueError(f"Erreur format SUPABASE_URL: {e}")

        # 3. Paramètres de connexion
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
            pool_pre_ping=True,
            connect_args={
                "connect_timeout": 10,
                "keepalives": 1,
                "keepalives_idle": 30,
                "keepalives_interval": 10,
                "keepalives_count": 5
            }
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
        st.error(f"Erreur SQL: {e}")
        return None
