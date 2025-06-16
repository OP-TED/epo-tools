import marimo

__generated_with = "0.13.9"
app = marimo.App(width="full", app_title="Install assets")


@app.cell
def _():
    import marimo as mo
    return (mo,)


@app.cell
def _():
    import os
    import tarfile
    import requests
    import sys
    from typing import Dict
    return os, requests, sys, tarfile


@app.cell
def _():
    branch = "release/5.1.0"
    tarball_url = (
        f"https://github.com/OP-TED/ePO/archive/refs/heads/{branch}.tar.gz"
    )
    local_dir = f"assets/{branch}"
    return local_dir, tarball_url


@app.cell(hide_code=True)
def _(mo):
    download_mappings = mo.ui.run_button(label="download formal artifacts")
    download_mappings
    return (download_mappings,)


@app.cell
def _(download_mappings, fetch_tar, local_dir, tarball_url):
    if download_mappings.value:
        fetch_tar(tarball_url, local_dir)
    return


@app.cell
def _(os, requests, sys, tarfile):
    def fetch_tar(tarball_url, local_directory) -> None:
        try:
            print(f"fetching {tarball_url} into {local_directory}")
            # Clean and create directory
            if os.path.exists(local_directory):
                os.system(f"rm -rf {local_directory}")
            os.makedirs(local_directory, exist_ok=True)

            # Download and extract tar file
            response = requests.get(tarball_url, stream=True)
            response.raise_for_status()

            # Save tar content to a temporary file
            temp_tar = "temp.tar.gz"
            with open(temp_tar, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            # Extract tar file
            with tarfile.open(temp_tar) as tar:
                # Strip first component and extract to local directory
                members = tar.getmembers()
                for member in members:
                    if member.path.count("/") > 0:
                        member.path = "/".join(member.path.split("/")[1:])
                        tar.extract(member, local_directory)

            # Clean up temporary file
            os.remove(temp_tar)
            print(f"Done")

        except Exception as error:
            print(f"Error updating latest release: {str(error)}", file=sys.stderr)
            sys.exit(1)
    return (fetch_tar,)


if __name__ == "__main__":
    app.run()
