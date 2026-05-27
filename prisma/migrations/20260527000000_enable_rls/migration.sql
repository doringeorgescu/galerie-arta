-- Enable Row Level Security on all tables
ALTER TABLE "Painting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order"    ENABLE ROW LEVEL SECURITY;

-- Painting: date publice → permite SELECT pentru toată lumea (anon + authenticated)
-- INSERT / UPDATE / DELETE rămân negate by default
CREATE POLICY "allow_public_select" ON "Painting"
  FOR SELECT USING (true);

-- Order: nicio politică → toate operațiile negate by default pentru anon/authenticated
-- Prisma (postgres role) bypass RLS → webhook și admin funcționează nemodificat
