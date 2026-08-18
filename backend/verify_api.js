require('dotenv').config();
const app = require('./server');
const http = require('http');

let server;
const PORT = 5999;
const AUTH_TOKEN = process.env.API_AUTH_TOKEN || 'dev-token-12345'; // default dev token in server.js

const runTests = async () => {
  console.log('🧪 Starting API Verification Tests...');

  // 1. Start Server on port 5999
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server listening on port ${PORT}`);

  const baseUrl = `http://localhost:${PORT}`;

  try {
    // Test 1: Fetch Aggregate Data
    console.log('\nTest 1: Fetching aggregate portfolio data...');
    const getDataRes = await fetch(`${baseUrl}/api/portfolio-data`);
    if (!getDataRes.ok) throw new Error(`GET /api/portfolio-data failed with status: ${getDataRes.status}`);
    const data = await getDataRes.json();
    console.log('✅ Aggregate data fetched successfully!');
    console.log(`- Config Hero Title: "${data.site_config.hero_title}"`);
    console.log(`- Projects Count: ${data.projects.length}`);
    console.log(`- Skills Count: ${data.skills.length}`);
    const originalHeroTitle = data.site_config.hero_title;

    if (data.projects.length === 0 || data.skills.length === 0) {
      throw new Error('Seed data is missing or empty!');
    }

    // Test 2: Protected endpoint check (should fail without token)
    console.log('\nTest 2: Verifying authorization protection (expecting 401)...');
    const updateConfigNoAuth = await fetch(`${baseUrl}/api/site-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hero_title: 'Unauthenticated Update' })
    });
    if (updateConfigNoAuth.status === 401) {
      console.log('✅ Request successfully blocked (401 Unauthorized)');
    } else {
      throw new Error(`Expected 401 Unauthorized, but got ${updateConfigNoAuth.status}`);
    }

    // Test 3: Protected site config update (should succeed with token)
    console.log('\nTest 3: Updating site config with proper credentials...');
    const updateConfigAuth = await fetch(`${baseUrl}/api/site-config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({ hero_title: 'Saif - Updated Hero Title' })
    });
    if (!updateConfigAuth.ok) throw new Error(`PUT /api/site-config failed with status ${updateConfigAuth.status}`);
    const updatedConfig = await updateConfigAuth.json();
    if (updatedConfig.hero_title === 'Saif - Updated Hero Title') {
      console.log('✅ Site config updated successfully!');
    } else {
      throw new Error(`Expected updated hero title but got "${updatedConfig.hero_title}"`);
    }

    // Test 4: Create new project (POST)
    console.log('\nTest 4: Creating a new project...');
    const createProjectRes = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({
        title: 'API Test Project',
        description: 'Verifying automated project insertion.',
        tech_stack: ['Node.js', 'Express', 'Mocha'],
        image_url: 'https://picsum.photos/600/400',
        live_url: 'https://test.com',
        github_url: 'https://github.com/test',
        order_index: 3
      })
    });
    if (!createProjectRes.ok) throw new Error(`POST /api/projects failed with status ${createProjectRes.status}`);
    const newProject = await createProjectRes.json();
    console.log(`✅ Project created successfully! ID: ${newProject.id}`);

    // Verify Project got added to list
    const checkDataRes = await fetch(`${baseUrl}/api/portfolio-data`);
    const checkData = await checkDataRes.json();
    const foundProject = checkData.projects.find(p => p.id === newProject.id);
    if (!foundProject) throw new Error('New project was not found in the aggregate data payload!');
    console.log('✅ Verified new project exists in aggregate list');

    // Test 5: Delete the created project (DELETE)
    console.log(`\nTest 5: Deleting the created project (ID: ${newProject.id})...`);
    const deleteProjectRes = await fetch(`${baseUrl}/api/projects/${newProject.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    if (!deleteProjectRes.ok) throw new Error(`DELETE /api/projects/${newProject.id} failed`);
    const deleteResult = await deleteProjectRes.json();
    console.log('✅ Project deletion response:', deleteResult);

    // Verify deletion
    const verifyDeleteRes = await fetch(`${baseUrl}/api/portfolio-data`);
    const verifyDeleteData = await verifyDeleteRes.json();
    const stillExists = verifyDeleteData.projects.some(p => p.id === newProject.id);
    if (stillExists) throw new Error('Project still exists after deletion!');
    console.log('✅ Verified project is removed from aggregate list');

    // Restore original site config title
    console.log('\nRestoring original site config title...');
    const restoreConfigRes = await fetch(`${baseUrl}/api/site-config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({ hero_title: originalHeroTitle })
    });
    if (restoreConfigRes.ok) {
      console.log('✅ Original site config title restored successfully!');
    }

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The REST API is robust and correct.');
  } catch (error) {
    console.error('\n❌ Test execution failed with error:', error);
    process.exitCode = 1;
  } finally {
    console.log('\nShutting down test server...');
    server.close();
  }
};

runTests();
