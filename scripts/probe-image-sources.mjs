const tests = [
  ["unsplash", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"],
  ["unsplash", "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=80"],
  ["unsplash", "https://images.unsplash.com/photo-1486427940722-48163b5e578c?w=400&q=80"],
  ["unsplash", "https://images.unsplash.com/photo-1555507035261-ab7e7033cb2b?w=400&q=80"],
  ["unsplash", "https://images.unsplash.com/photo-1517433674957-0d3ef0708000?w=400&q=80"],
  ["unsplash", "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&q=80"],
  ["wikimedia", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Chestnuts_in_their_burs.jpg/1280px-Chestnuts_in_their_burs.jpg"],
  ["wikimedia", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Kneading_bread_dough.jpg/1280px-Kneading_bread_dough.jpg"],
  ["wikimedia", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Fresh_baked_bread.jpg/1280px-Fresh_baked_bread.jpg"]
];
for (const [p, url] of tests) {
  const r = await fetch(url, { method: "HEAD", redirect: "follow" });
  console.log(p, r.status, url.slice(0, 70));
}