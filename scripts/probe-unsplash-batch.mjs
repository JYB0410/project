const candidates = [
  "photo-1509440159596-0249088772ff",
  "photo-1549931319-a545dcf3bc73",
  "photo-1608198093002-ad4e005484ec",
  "photo-1578985545062-69928b1d9587",
  "photo-1586985289686-a345c1032cd3",
  "photo-1558961363-fa8fdf82db35",
  "photo-1595475207222-428b62bda831",
  "photo-1612207691145-643e2d9d5a93",
  "photo-1519869326170-9d1f0229022a",
  "photo-1608194831471-5d81a3b3a4b1",
  "photo-1486427940722-48163b5e578c",
  "photo-1447933601403-0c6688de566e",
  "photo-1464349095430-e2a80857a941",
  "photo-1509440159596-0249088772ff",
  "photo-1532550896082-ab06d10cea93",
  "photo-1542838137-7c35d9e4ae1a",
  "photo-1555507035261-ab7e7033cb2b",
  "photo-1586444244696-9fd2ae5fad0a",
  "photo-1615365230967-4c8d0d4c7e8e",
  "photo-1626082927389-6ddc589b0f2f"
];
const ok = [];
for (const id of candidates) {
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
  const res = await fetch(url, { redirect: "follow" });
  const buf = await res.arrayBuffer();
  if (res.ok && buf.byteLength > 15000) ok.push([id, buf.byteLength]);
}
console.log("OK:", ok);