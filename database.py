import os
from typing import Optional
import streamlit as st
from supabase import create_client, Client
from dotenv import load_dotenv

# Charger le .env en local (ignoré sur Streamlit Cloud qui utilise secrets.toml)
load_dotenv()

@st.cache_resource
def init_supabase_connection() -> Client:
    """
    Initialise la connexion au client Supabase.
    Utilise l'API REST Supabase au lieu de connexion PostgreSQL directe.
    Cela évite les problèmes IPv4/IPv6 et est la méthode recommandée par Streamlit.
    """
    # Récupération des secrets
    # Essayer d'abord st.secrets (Streamlit Cloud), puis les variables d'environnement (local)
    try:
        supabase_url = st.secrets.get('SUPABASE_URL')
        supabase_key = st.secrets.get('SUPABASE_API_KEY')
    except (FileNotFoundError, KeyError):
        # En local, utiliser les variables d'environnement depuis .env
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_API_KEY')

    if not supabase_url or not supabase_key:
        raise ValueError("Configuration manquante: SUPABASE_URL et SUPABASE_API_KEY requis")

    try:
        client = create_client(supabase_url, supabase_key)
        return client
    except Exception as e:
        st.error(f"Erreur lors de l'initialisation du client Supabase: {e}")
        raise


def execute_query(table: str, columns: str = "*", filters: Optional[dict] = None):
    """
    Exécute une requête SELECT sur une table Supabase.

    Args:
        table: Nom de la table
        columns: Colonnes à sélectionner (défaut: "*")
        filters: Dictionnaire de filtres (ex: {"status": "active"})

    Returns:
        Liste de dictionnaires représentant les lignes
    """
    try:
        client = init_supabase_connection()
        query = client.table(table).select(columns)

        # Appliquer les filtres si fournis
        if filters:
            for key, value in filters.items():
                query = query.eq(key, value)

        response = query.execute()
        return response.data
    except Exception as e:
        st.error(f"Erreur lors de la requête sur {table}: {e}")
        return None


def insert_data(table: str, data: dict):
    """Insert des données dans une table Supabase"""
    try:
        client = init_supabase_connection()
        response = client.table(table).insert(data).execute()
        st.success(f"Données insérées dans {table}")
        return response.data
    except Exception as e:
        st.error(f"Erreur lors de l'insertion dans {table}: {e}")
        return None


def update_data(table: str, data: dict, filters: dict):
    """Update des données dans une table Supabase"""
    try:
        client = init_supabase_connection()
        query = client.table(table).update(data)

        for key, value in filters.items():
            query = query.eq(key, value)

        response = query.execute()
        st.success(f"Données mises à jour dans {table}")
        return response.data
    except Exception as e:
        st.error(f"Erreur lors de la mise à jour dans {table}: {e}")
        return None


def delete_data(table: str, filters: dict):
    """Supprime des données d'une table Supabase"""
    try:
        client = init_supabase_connection()
        query = client.table(table).delete()

        for key, value in filters.items():
            query = query.eq(key, value)

        response = query.execute()
        st.success(f"Données supprimées de {table}")
        return response.data
    except Exception as e:
        st.error(f"Erreur lors de la suppression dans {table}: {e}")
        return None
