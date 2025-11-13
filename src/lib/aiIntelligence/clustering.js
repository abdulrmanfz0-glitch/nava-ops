/**
 * AI Intelligence Layer - Category Clustering System
 * Groups categories based on performance patterns using K-means-like clustering
 */

/**
 * Calculate Euclidean distance between two points
 */
function euclideanDistance(point1, point2) {
  return Math.sqrt(
    point1.reduce((sum, val, i) => sum + Math.pow(val - point2[i], 2), 0)
  );
}

/**
 * Normalize data to 0-1 range
 */
function normalizeData(data) {
  if (data.length === 0) return data;

  const features = data[0].features.length;
  const normalized = [];

  // Find min and max for each feature
  const mins = Array(features).fill(Infinity);
  const maxs = Array(features).fill(-Infinity);

  data.forEach(item => {
    item.features.forEach((val, i) => {
      mins[i] = Math.min(mins[i], val);
      maxs[i] = Math.max(maxs[i], val);
    });
  });

  // Normalize
  data.forEach(item => {
    const normalizedFeatures = item.features.map((val, i) => {
      const range = maxs[i] - mins[i];
      return range > 0 ? (val - mins[i]) / range : 0;
    });

    normalized.push({
      ...item,
      features: normalizedFeatures,
      originalFeatures: item.features
    });
  });

  return normalized;
}

/**
 * K-means clustering algorithm
 */
function kMeansClustering(data, k = 3, maxIterations = 50) {
  if (data.length < k) {
    k = Math.max(1, data.length);
  }

  // Initialize centroids randomly
  const centroids = [];
  const usedIndices = new Set();

  for (let i = 0; i < k; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * data.length);
    } while (usedIndices.has(randomIndex));

    usedIndices.add(randomIndex);
    centroids.push([...data[randomIndex].features]);
  }

  let assignments = Array(data.length).fill(0);
  let iterations = 0;

  while (iterations < maxIterations) {
    // Assign points to nearest centroid
    const newAssignments = data.map(item => {
      const distances = centroids.map(centroid =>
        euclideanDistance(item.features, centroid)
      );
      return distances.indexOf(Math.min(...distances));
    });

    // Check for convergence
    if (JSON.stringify(newAssignments) === JSON.stringify(assignments)) {
      break;
    }

    assignments = newAssignments;

    // Update centroids
    for (let i = 0; i < k; i++) {
      const clusterPoints = data.filter((_, index) => assignments[index] === i);

      if (clusterPoints.length > 0) {
        const features = clusterPoints[0].features.length;
        centroids[i] = Array(features).fill(0).map((_, featureIndex) => {
          const sum = clusterPoints.reduce((s, p) => s + p.features[featureIndex], 0);
          return sum / clusterPoints.length;
        });
      }
    }

    iterations++;
  }

  return { assignments, centroids };
}

/**
 * Cluster categories based on performance metrics
 */
export function clusterCategories(categories, options = {}) {
  const { numClusters = 3 } = options;

  if (!categories || categories.length === 0) {
    return {
      clusters: [],
      insights: []
    };
  }

  // Extract features from categories
  const data = categories.map(category => ({
    id: category.id,
    name: category.name,
    features: [
      category.revenue || 0,
      category.orders || 0,
      category.avgOrderValue || 0,
      category.conversionRate || 0,
      category.growthRate || 0
    ],
    category
  }));

  // Normalize data
  const normalized = normalizeData(data);

  // Perform clustering
  const { assignments, centroids } = kMeansClustering(normalized, numClusters);

  // Group categories by cluster
  const clusters = [];
  for (let i = 0; i < numClusters; i++) {
    const clusterCategories = data.filter((_, index) => assignments[index] === i);

    if (clusterCategories.length > 0) {
      // Calculate cluster statistics
      const avgRevenue = clusterCategories.reduce((sum, c) => sum + c.features[0], 0) / clusterCategories.length;
      const avgOrders = clusterCategories.reduce((sum, c) => sum + c.features[1], 0) / clusterCategories.length;
      const avgGrowth = clusterCategories.reduce((sum, c) => sum + c.features[4], 0) / clusterCategories.length;

      // Determine cluster type
      let clusterType = 'average';
      let clusterLabel = 'Average Performers';

      if (avgRevenue > 0 && avgGrowth > 5) {
        clusterType = 'star';
        clusterLabel = 'Star Performers';
      } else if (avgRevenue > 0 && avgGrowth < -5) {
        clusterType = 'declining';
        clusterLabel = 'Declining Categories';
      } else if (avgOrders > 0 && avgRevenue / avgOrders < 20) {
        clusterType = 'low_value';
        clusterLabel = 'Low Value Categories';
      } else if (avgRevenue > 0) {
        clusterType = 'steady';
        clusterLabel = 'Steady Performers';
      }

      clusters.push({
        id: i,
        type: clusterType,
        label: clusterLabel,
        categories: clusterCategories.map(c => c.category),
        count: clusterCategories.length,
        characteristics: {
          avgRevenue,
          avgOrders,
          avgGrowth
        },
        centroid: centroids[i]
      });
    }
  }

  // Sort clusters by average revenue
  clusters.sort((a, b) => b.characteristics.avgRevenue - a.characteristics.avgRevenue);

  // Generate insights
  const insights = generateClusterInsights(clusters);

  return {
    clusters,
    insights,
    summary: {
      totalCategories: categories.length,
      numClusters: clusters.length,
      stars: clusters.filter(c => c.type === 'star').length,
      declining: clusters.filter(c => c.type === 'declining').length
    }
  };
}

/**
 * Generate insights from clusters
 */
function generateClusterInsights(clusters) {
  const insights = [];

  clusters.forEach(cluster => {
    const { type, label, count, characteristics } = cluster;

    switch (type) {
      case 'star':
        insights.push({
          type: 'opportunity',
          title: `${count} Star Categories Driving Growth`,
          description: `These categories show strong revenue (avg $${characteristics.avgRevenue.toFixed(0)}) and growth (${characteristics.avgGrowth.toFixed(1)}%).`,
          action: 'Invest more in marketing and inventory for these categories',
          clusterId: cluster.id
        });
        break;

      case 'declining':
        insights.push({
          type: 'warning',
          title: `${count} Categories Showing Decline`,
          description: `Revenue declining at ${Math.abs(characteristics.avgGrowth).toFixed(1)}% rate.`,
          action: 'Review and refresh offerings, or consider phasing out',
          clusterId: cluster.id
        });
        break;

      case 'low_value':
        insights.push({
          type: 'info',
          title: `${count} Low-Value Categories`,
          description: 'High order volume but low average order value.',
          action: 'Consider bundling strategies or upselling opportunities',
          clusterId: cluster.id
        });
        break;

      case 'steady':
        insights.push({
          type: 'info',
          title: `${count} Steady Performers`,
          description: 'Consistent revenue with stable performance.',
          action: 'Maintain current strategy and monitor for changes',
          clusterId: cluster.id
        });
        break;
    }
  });

  return insights;
}

/**
 * Cluster branches based on performance
 */
export function clusterBranches(branches, options = {}) {
  const { numClusters = 4 } = options;

  if (!branches || branches.length === 0) {
    return { clusters: [], insights: [] };
  }

  // Extract features from branches
  const data = branches.map(branch => {
    const history = branch.history || [];
    const recent = history.slice(-7);

    const avgRevenue = recent.reduce((sum, h) => sum + (h.revenue || 0), 0) / 7;
    const avgOrders = recent.reduce((sum, h) => sum + (h.orders || 0), 0) / 7;
    const avgCustomers = recent.reduce((sum, h) => sum + (h.customers || 0), 0) / 7;

    // Calculate growth
    const previous = history.slice(-14, -7);
    const prevRevenue = previous.length > 0
      ? previous.reduce((sum, h) => sum + (h.revenue || 0), 0) / previous.length
      : avgRevenue;
    const growth = prevRevenue > 0 ? ((avgRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    return {
      id: branch.id,
      name: branch.name,
      features: [
        avgRevenue,
        avgOrders,
        avgCustomers,
        branch.rating || 3.5,
        growth
      ],
      branch
    };
  });

  // Normalize and cluster
  const normalized = normalizeData(data);
  const { assignments, centroids } = kMeansClustering(normalized, numClusters);

  // Group branches by cluster
  const clusters = [];
  for (let i = 0; i < numClusters; i++) {
    const clusterBranches = data.filter((_, index) => assignments[index] === i);

    if (clusterBranches.length > 0) {
      const avgRevenue = clusterBranches.reduce((sum, b) => sum + b.features[0], 0) / clusterBranches.length;
      const avgGrowth = clusterBranches.reduce((sum, b) => sum + b.features[4], 0) / clusterBranches.length;
      const avgRating = clusterBranches.reduce((sum, b) => sum + b.features[3], 0) / clusterBranches.length;

      let clusterType = 'average';
      let clusterLabel = 'Average Performance';

      if (avgRevenue > 0 && avgGrowth > 5 && avgRating >= 4.0) {
        clusterType = 'high_performer';
        clusterLabel = 'High Performers';
      } else if (avgGrowth < -5 || avgRating < 3.5) {
        clusterType = 'needs_attention';
        clusterLabel = 'Needs Attention';
      } else if (avgGrowth > 0) {
        clusterType = 'growing';
        clusterLabel = 'Growing Branches';
      }

      clusters.push({
        id: i,
        type: clusterType,
        label: clusterLabel,
        branches: clusterBranches.map(b => b.branch),
        count: clusterBranches.length,
        characteristics: {
          avgRevenue,
          avgGrowth,
          avgRating
        }
      });
    }
  }

  const insights = generateBranchClusterInsights(clusters);

  return { clusters, insights };
}

/**
 * Generate insights from branch clusters
 */
function generateBranchClusterInsights(clusters) {
  const insights = [];

  clusters.forEach(cluster => {
    const { type, count, characteristics } = cluster;

    switch (type) {
      case 'high_performer':
        insights.push({
          type: 'success',
          title: `${count} High-Performing Branches`,
          description: `Strong growth (${characteristics.avgGrowth.toFixed(1)}%) and ratings (${characteristics.avgRating.toFixed(1)})`,
          action: 'Document best practices and share with other branches'
        });
        break;

      case 'needs_attention':
        insights.push({
          type: 'warning',
          title: `${count} Branches Need Support`,
          description: 'Below-average performance or ratings',
          action: 'Provide additional training and operational support'
        });
        break;

      case 'growing':
        insights.push({
          type: 'opportunity',
          title: `${count} Branches Showing Growth`,
          description: `Positive momentum with ${characteristics.avgGrowth.toFixed(1)}% growth`,
          action: 'Maintain support and monitor continued progress'
        });
        break;
    }
  });

  return insights;
}

/**
 * Cluster customers based on behavior
 */
export function clusterCustomers(customers, options = {}) {
  const { numClusters = 3 } = options;

  if (!customers || customers.length === 0) {
    return { clusters: [], insights: [] };
  }

  const data = customers.map(customer => ({
    id: customer.id,
    name: customer.name,
    features: [
      customer.totalSpent || 0,
      customer.orderCount || 0,
      customer.avgOrderValue || 0,
      customer.daysSinceLastOrder || 0,
      customer.lifetimeValue || 0
    ],
    customer
  }));

  const normalized = normalizeData(data);
  const { assignments } = kMeansClustering(normalized, numClusters);

  const clusters = [];
  for (let i = 0; i < numClusters; i++) {
    const clusterCustomers = data.filter((_, index) => assignments[index] === i);

    if (clusterCustomers.length > 0) {
      const avgSpent = clusterCustomers.reduce((sum, c) => sum + c.features[0], 0) / clusterCustomers.length;
      const avgOrders = clusterCustomers.reduce((sum, c) => sum + c.features[1], 0) / clusterCustomers.length;

      let clusterType = 'regular';
      if (avgSpent > 500 && avgOrders > 10) {
        clusterType = 'vip';
      } else if (avgOrders < 2) {
        clusterType = 'new';
      } else if (avgSpent < 100) {
        clusterType = 'occasional';
      }

      clusters.push({
        id: i,
        type: clusterType,
        label: clusterType.toUpperCase(),
        customers: clusterCustomers.map(c => c.customer),
        count: clusterCustomers.length,
        characteristics: { avgSpent, avgOrders }
      });
    }
  }

  return { clusters, insights: [] };
}
