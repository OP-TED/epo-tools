import marimo

__generated_with = "0.13.15"
app = marimo.App(width="full")


@app.cell
def _():
    import marimo as mo
    import sqlite3
    import pandas as pd
    return mo, pd, sqlite3


@app.cell
def _(mo):
    mo.md(
        """
    # Enterprise Architect Database Explorer

    Select an Enterprise Architect `.qea` file to explore
    """
    )
    return


@app.cell
def _(mo):
    file_picker = mo.ui.file(
        filetypes=[".qea"],
        kind="button",
        label="Upload .qea file"
    )
    file_picker
    return (file_picker,)


@app.cell
def _(file_picker, mo, sqlite3):
    import tempfile
    import os
    
    if file_picker.value is not None:
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".qea") as tmp:
            tmp.write(file_picker.value[0].contents)
            db_path = tmp.name
        conn = sqlite3.connect(db_path)
        mo.md(f"✅ Connected to: `{file_picker.value[0].name}`")
    else:
        # Default file
        db_path = "/home/cvasquez/github.com/OP-TED/epo-tools/ePO_CM.qea"
        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            mo.md(f"📂 Using default: `{db_path}`")
        else:
            conn = None
            mo.md("⚠️ Please upload a .qea file")
    
    return (conn,)


@app.cell
def _(conn, pd):
    if conn is not None:
        # Get object type statistics
        object_stats = pd.read_sql_query(
            """
            SELECT Object_Type, COUNT(*) as count 
            FROM t_object 
            GROUP BY Object_Type 
            ORDER BY count DESC
        """,
            conn,
        )
        object_stats
    else:
        None
    return


@app.cell
def _(mo):
    mo.md("""## Packages""")
    return


@app.cell
def _(conn, pd):
    if conn is not None:
        packages = pd.read_sql_query(
            """
            SELECT Package_ID, Name, Parent_ID, Notes
            FROM t_package 
            ORDER BY Name
        """,
            conn,
        )
        packages
    else:
        None
    return


@app.cell
def _(mo):
    mo.md("""## Classes""")
    return


@app.cell
def _(conn, pd):
    if conn is not None:
        classes = pd.read_sql_query(
            """
            SELECT Object_ID, Name, Stereotype, Note, Package_ID
            FROM t_object 
            WHERE Object_Type = 'Class'
            ORDER BY Name
        """,
            conn,
        )
        classes
    else:
        None
    return


@app.cell
def _(mo):
    mo.md("""## Enumerations""")
    return


@app.cell
def _(conn, pd):
    if conn is not None:
        enums = pd.read_sql_query(
            """
            SELECT Object_ID, Name, Note, Package_ID
            FROM t_object 
            WHERE Object_Type = 'Enumeration'
            ORDER BY Name
        """,
            conn,
        )
        enums
    else:
        None
    return


@app.cell
def _(mo):
    mo.md("""## Connectors (Relationships)""")
    return


@app.cell
def _(conn, pd):
    if conn is not None:
        connectors = pd.read_sql_query(
            """
            SELECT 
                c.Connector_Type,
                start_obj.Name as Start_Object,
                end_obj.Name as End_Object,
                c.SourceRole,
                c.DestRole
            FROM t_connector c
            JOIN t_object start_obj ON c.Start_Object_ID = start_obj.Object_ID
            JOIN t_object end_obj ON c.End_Object_ID = end_obj.Object_ID
            LIMIT 100
        """,
            conn,
        )
        connectors
    else:
        None
    return


if __name__ == "__main__":
    app.run()
