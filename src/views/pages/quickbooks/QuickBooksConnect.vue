<template>
  <div>
    <h1>Connect to QuickBooks</h1>
    <button @click="connectToQuickBooks">Connect</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    async connectToQuickBooks() {
      try {
        const response = await axios.get('http://localhost:5000/api/quickbooks/connect');
        window.location.href = response.data.authUri;
      } catch (error) {
        console.error('Error connecting to QuickBooks:', error);
      }
    }
  }
}
</script>
