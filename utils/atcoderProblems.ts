import fetch from 'node-fetch'

type ProblemSummary = {
  id: string
  contest_id: string
  title: string
}
type ProblemModel = {
  slope?: number
  intercept?: number
  variance?: number
  difficulty?: number
  discrimination?: number
  irt_loglikelihood?: number
  irt_users?: number
  is_experimental?: boolean
}

type Problem = {
  id: string
  contest_id: string
  title: string
  difficulty: number
}

const baseUrl = 'https://kenkoooo.com/atcoder/resources'

let problems: Problem[] = []

let lastUpdated = Date.now()

const fetchProblems = async () => {
  let response = await fetch(`${baseUrl}/problems.json`)
  if (!response.ok) throw new Error(`failed to fetch data from ${baseUrl}/problems.json`)
  const probsData = (await response.json()) as ProblemSummary[]

  response = await fetch(`${baseUrl}/problem-models.json`)
  if (!response.ok) throw new Error(`failed to fetch data from ${baseUrl}/problem-models.json`)
  const probsDiffData = (await response.json()) as { [key: string]: ProblemModel }

  const diffs = new Map<string, number>()

  Object.entries(probsDiffData).forEach(([id, { difficulty }]) => {
    if (!difficulty) return
    if (difficulty < 400) {
      while (true) {
        difficulty = 400 / Math.exp((400 - difficulty) / 400)
        if (difficulty > 0) break
      }
    }
    diffs.set(id, difficulty)
  })

  probsData.forEach(problem => {
    if (diffs.has(problem.id)) problems.push({ ...problem, difficulty: Math.round(diffs.get(problem.id) ?? 0) })
  })

  const compare = (a: Problem, b: Problem) => a.difficulty - b.difficulty

  problems.sort(compare)
}

const initialFetch = async () => {
  if (!problems.length || Date.now() - lastUpdated > 1000 * 60 * 60 * 24) {
    await fetchProblems()
    lastUpdated = Date.now()
  }
}

// 指定された要素以上の値が現れる最初の位置
const getProblemIndex = (diff: number) => {
  let left = -1
  let right = problems.length
  while (right - left > 1) {
    let mid = left + Math.floor((right - left) / 2)
    if (problems[mid].difficulty >= diff) right = mid
    else left = mid
  }
  return right
}

export const getProblemsByDiff = async (min: number, max: number) => {
  await initialFetch()
  const minIndex = getProblemIndex(min)
  const maxIndex = getProblemIndex(max)
  if (minIndex > maxIndex - 1) return []
  else return problems.slice(minIndex, maxIndex)
}
