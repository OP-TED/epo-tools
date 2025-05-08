import marimo

__generated_with = "0.12.10"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    return (mo,)


@app.cell
def _():
    2
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
