FROM gitpod/workspace-full

# Install Platform.sh CLI
RUN curl -fsSL https://raw.githubusercontent.com/platformsh/cli/main/installer.sh | bash

# Install Fly
RUN curl -L https://fly.io/install.sh | sh
ENV FLYCTL_INSTALL="/home/gitpod/.fly"
ENV PATH="$FLYCTL_INSTALL/bin:$PATH"

# Install GitHub CLI
RUN brew install gh
