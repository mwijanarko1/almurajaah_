const getRevisionTimeDisplay = () => {
  if (!daysSinceRevision) return 'Revise in 7 days'
  if (daysSinceRevision >= revisionCycle) return 'Revise now'
  
  const daysUntilRevision = revisionCycle - daysSinceRevision
  if (daysUntilRevision <= 0) return 'Revise now'
  
  const daysText = daysUntilRevision === 1 ? 'day' : 'days'
  const revisionText = needsRevision 
    ? `Revise in ${daysUntilRevision} ${daysText}`
    : 'Relax'
  return revisionText
} 