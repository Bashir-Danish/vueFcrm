#!/bin/bash
echo "========== Running setup script =========="

# Install Shadcn Vue components
echo "Installing Shadcn Vue components"
yes | npx shadcn-vue@latest add form
yes | npx shadcn-vue@latest add input
yes | npx shadcn-vue@latest add button
yes | npx shadcn-vue@latest add popover
yes | npx shadcn-vue@latest add toast

echo "========== Done setup script =========="
