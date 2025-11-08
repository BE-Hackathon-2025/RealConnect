/* =========================================
   The Real Connect — Community Wall logic
   No anonymous posts
   ========================================= */

(function(){
  const LS_POSTS = 'trc.community.v1';
  const LS_NAME  = 'trc.name.v1';

  // Elements
  const feedEl        = document.getElementById('feed');
  const chips         = [...document.querySelectorAll('.chip')];
  const openSettings  = document.getElementById('openSettings');
  const settingsDlg   = document.getElementById('settingsModal');
  const settingsBg    = document.getElementById('settingsBackdrop');
  const closeSettings = document.getElementById('closeSettings');
  const savePrivate   = document.getElementById('savePrivateName');
  const privateInput  = document.getElementById('privateNameInput');

  const form          = document.getElementById('composerForm');
  const postCategory  = document.getElementById('postCategory');
  const postName      = document.getElementById('postName');
  const usePrivate    = document.getElementById('usePrivateName');
  const postText      = document.getElementById('postText');
  const postLink      = document.getElementById('postLink');
  const charCount     = document.getElementById('charCount');
  const postBtn       = document.getElementById('postBtn');

  // State
  let posts = loadPosts();
  let currentFilter = 'all';
  let privateName = (localStorage.getItem(LS_NAME) || '').trim();

  // Init UI
  if (privateName) privateInput.value = privateName;
  render();

  // Character count
  postText.addEventListener('input', () => {
    charCount.textContent = String(postText.value.length);
  });

  // Enable/disable Post button — must have a name or saved private name
  function updatePostButtonState(){
    const typed = postName.value.trim();
    const okViaPrivate = usePrivate.checked && privateName.length > 0;
    postBtn.disabled = !(typed.length > 0 || okViaPrivate) || postText.value.trim().length === 0;
  }
  postName.addEventListener('input', updatePostButtonState);
  postText.addEventListener('input', updatePostButtonState);
  usePrivate.addEventListener('change', updatePostButtonState);
  updatePostButtonState();

  // Filters
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      render();
    });
  });

  // Open/close settings
  openSettings.addEventListener('click', () => {
    settingsBg.hidden = false;
    settingsDlg.showModal();
    privateInput.focus();
  });
  function closeSettingsDialog(){
    settingsDlg.close();
    settingsBg.hidden = true;
  }
  closeSettings.addEventListener('click', (e) => {
    e.preventDefault();
    closeSettingsDialog();
  });
  savePrivate.addEventListener('click', (e) => {
    e.preventDefault();
    const val = privateInput.value.trim();
    if (!val){
      alert('Please enter a name to save.');
      return;
    }
    privateName = val;
    localStorage.setItem(LS_NAME, privateName);
    closeSettingsDialog();
    updatePostButtonState();
  });

  // Submit post
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const cat  = postCategory.value;
    const text = postText.value.trim();
    const url  = postLink.value.trim();
    const typedName = postName.value.trim();

    let displayName = '';
    if (usePrivate.checked){
      if (!privateName){
        alert('No private name saved yet. Click “Private Name”, save one, or type your name above.');
        return;
      }
      displayName = privateName;
    } else {
      if (!typedName){
        alert('Please enter your name before posting.');
        return;
      }
      displayName = typedName;
    }

    if (!text){
      alert('Please write a message.');
      return;
    }

    const post = {
      id: cryptoRandomId(),
      cat,
      name: displayName,
      text,
      link: url || '',
      ts: Date.now()
    };

    posts.unshift(post);
    savePosts(posts);
    form.reset();
    charCount.textContent = '0';
    updatePostButtonState();
    render();
  });

  // Render feed
  function render(){
    const filtered = posts.filter(p => currentFilter === 'all' ? true : p.cat === currentFilter);
    feedEl.innerHTML = filtered.map(postToHTML).join('') || emptyStateHTML();
  }

  // Helpers
  function postToHTML(p){
    const badge = p.cat === 'events' ? 'Event'
                : p.cat === 'mutual' ? 'Mutual'
                : 'Message';
    const ago = timeAgo(p.ts);
    const link = p.link ? `<div><a href="${escapeAttr(p.link)}" target="_blank" rel="noopener">Open link ↗</a></div>` : '';
    return `
      <article class="post" aria-label="${badge} from ${escapeHtml(p.name)}">
        <div class="post-head">
          <span class="badge">${badge}</span>
          <span class="name">${escapeHtml(p.name)}</span>
          <time class="when" datetime="${new Date(p.ts).toISOString()}">${ago}</time>
        </div>
        <div class="post-body">${escapeHtml(p.text)}</div>
        ${link}
      </article>
    `;
  }
  function emptyStateHTML(){
    return `
      <article class="post">
        <div class="post-body">
          No posts yet. Be the first to share a message, event, or mutual aid request.
        </div>
      </article>
    `;
  }

  function savePosts(list){
    localStorage.setItem(LS_POSTS, JSON.stringify(list));
  }
  function loadPosts(){
    try{
      const raw = localStorage.getItem(LS_POSTS);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    }catch{
      return [];
    }
  }

  function timeAgo(ts){
    const s = Math.floor((Date.now() - ts)/1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s/60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m/60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h/24);
    return `${d}d ago`;
  }

  function cryptoRandomId(){
    if (window.crypto?.randomUUID) return crypto.randomUUID();
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  /* Escape helpers */
  function escapeHtml(str){
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#39;");
  }
  function escapeAttr(str){
    return escapeHtml(str).replaceAll('(', '&#40;').replaceAll(')', '&#41;');
  }
})();
