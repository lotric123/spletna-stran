async function loadXML(url) {
  const response = await fetch(url);
  const text = await response.text();
  return (new window.DOMParser()).parseFromString(text, "application/xml");
}

function createNavigation(pages) {
  const nav = document.getElementById('navigation');
  pages.forEach((page, i) => {
    const btn = document.createElement('button');
    btn.textContent = page.title;
    btn.onclick = () => renderPage(page);
    nav.appendChild(btn);
  });
}

function renderPage(page) {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h1>${page.title}</h1>
    <p>${page.text}</p>
    <div>
      ${page.links.map(link => `<a href="${link.href}" target="_blank">${link.text}</a>`).join(' ')}
    </div>
    <div>
      ${page.images.map(img => `<img src="${img.src}" alt="${img.alt}"/>`).join(' ')}
    </div>
  `;
}

function parsePages(xmlDoc) {
  const pages = [];
  xmlDoc.querySelectorAll('page').forEach(pageNode => {
    const title = pageNode.querySelector('title')?.textContent || "";
    const text = pageNode.querySelector('text')?.textContent || "";
    const links = Array.from(pageNode.querySelectorAll('links link')).map(linkNode => ({
      href: linkNode.getAttribute('href'),
      text: linkNode.textContent
    }));
    const images = Array.from(pageNode.querySelectorAll('images image')).map(imgNode => ({
      src: imgNode.getAttribute('src'),
      alt: imgNode.getAttribute('alt')
    }));
    pages.push({ title, text, links, images });
  });
  return pages;
}

window.onload = async () => {
  const xmlDoc = await loadXML('pages.xml');
  const pages = parsePages(xmlDoc);
  createNavigation(pages);
  if (pages.length > 0) renderPage(pages[0]);
};
