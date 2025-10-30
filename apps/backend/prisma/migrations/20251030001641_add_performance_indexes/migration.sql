-- CreateIndex
CREATE INDEX "characters_userId_idx" ON "characters"("userId");

-- CreateIndex
CREATE INDEX "characters_userId_createdAt_idx" ON "characters"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "stories_userId_idx" ON "stories"("userId");

-- CreateIndex
CREATE INDEX "stories_userId_createdAt_idx" ON "stories"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "stories_genre_idx" ON "stories"("genre");

-- CreateIndex
CREATE INDEX "stories_language_idx" ON "stories"("language");
