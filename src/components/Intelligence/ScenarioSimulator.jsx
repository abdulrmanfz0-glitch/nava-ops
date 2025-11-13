// src/components/Intelligence/ScenarioSimulator.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Percent,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

/**
 * What-If Scenario Simulator
 * Allows users to simulate business scenarios and see predicted outcomes
 */
const ScenarioSimulator = ({ baseMetrics, onSimulate, className = '' }) => {
  const [scenarios, setScenarios] = useState([
    {
      name: 'Price Increase 10%',
      changes: { priceChange: 10, elasticity: -1.2 },
      active: false,
    },
    {
      name: 'Revenue Growth 15%',
      changes: { revenueChange: 15 },
      active: false,
    },
    {
      name: 'Cost Reduction 10%',
      changes: { costsChange: -10 },
      active: false,
    },
    {
      name: 'Optimize Staffing -15%',
      changes: { staffingChange: -15 },
      active: false,
    },
  ]);

  const [customScenario, setCustomScenario] = useState({
    revenueChange: 0,
    costsChange: 0,
    priceChange: 0,
    staffingChange: 0,
  });

  const [simulationResults, setSimulationResults] = useState(null);

  const runSimulation = (scenarioChanges) => {
    // Simulate the scenario using the intelligence engine logic
    const simulated = { ...baseMetrics };

    // Apply changes
    if (scenarioChanges.revenueChange) {
      simulated.revenue = baseMetrics.revenue * (1 + scenarioChanges.revenueChange / 100);
    }
    if (scenarioChanges.costsChange) {
      simulated.costs = baseMetrics.costs * (1 + scenarioChanges.costsChange / 100);
    }
    if (scenarioChanges.priceChange) {
      const elasticity = scenarioChanges.elasticity || -1.2;
      const volumeChange = scenarioChanges.priceChange * elasticity;
      const volume = baseMetrics.volume || baseMetrics.orders || 1000;
      simulated.volume = volume * (1 + volumeChange / 100);
      simulated.revenue =
        baseMetrics.revenue *
        (1 + scenarioChanges.priceChange / 100) *
        (1 + volumeChange / 100);
    }
    if (scenarioChanges.staffingChange) {
      const staffCosts = baseMetrics.staffCosts || baseMetrics.costs * 0.3;
      simulated.staffCosts = staffCosts * (1 + scenarioChanges.staffingChange / 100);
      simulated.costs =
        baseMetrics.costs -
        staffCosts +
        simulated.staffCosts;
    }

    // Calculate derived metrics
    simulated.profit = simulated.revenue - simulated.costs;
    simulated.profitMargin = (simulated.profit / simulated.revenue) * 100;

    // Calculate deltas
    const impact = {
      revenueDelta: simulated.revenue - baseMetrics.revenue,
      profitDelta: simulated.profit - (baseMetrics.revenue - baseMetrics.costs),
      marginDelta:
        simulated.profitMargin -
        ((baseMetrics.revenue - baseMetrics.costs) / baseMetrics.revenue) * 100,
    };

    // Generate recommendation
    let recommendation = '';
    let recommendationColor = 'text-gray-600';

    if (impact.profitDelta > 0 && impact.marginDelta > 0) {
      recommendation = 'Highly recommended - improves both profit and margin';
      recommendationColor = 'text-green-600 dark:text-green-400';
    } else if (impact.profitDelta > 0) {
      recommendation = 'Recommended - increases total profit';
      recommendationColor = 'text-blue-600 dark:text-blue-400';
    } else if (impact.marginDelta > 0) {
      recommendation = 'Consider - improves efficiency but may reduce scale';
      recommendationColor = 'text-yellow-600 dark:text-yellow-400';
    } else {
      recommendation = 'Not recommended - negative impact on profitability';
      recommendationColor = 'text-red-600 dark:text-red-400';
    }

    return {
      results: simulated,
      impact,
      recommendation,
      recommendationColor,
    };
  };

  const handlePresetSimulation = (index) => {
    const scenario = scenarios[index];
    const results = runSimulation(scenario.changes);
    setSimulationResults({ ...results, name: scenario.name });

    // Update active state
    const newScenarios = scenarios.map((s, i) => ({
      ...s,
      active: i === index,
    }));
    setScenarios(newScenarios);
  };

  const handleCustomSimulation = () => {
    const results = runSimulation(customScenario);
    setSimulationResults({ ...results, name: 'Custom Scenario' });

    // Deactivate all presets
    setScenarios(scenarios.map((s) => ({ ...s, active: false })));
  };

  const resetSimulation = () => {
    setSimulationResults(null);
    setScenarios(scenarios.map((s) => ({ ...s, active: false })));
    setCustomScenario({
      revenueChange: 0,
      costsChange: 0,
      priceChange: 0,
      staffingChange: 0,
    });
  };

  const MetricCard = ({ label, baseValue, newValue, icon: Icon, prefix = '$' }) => {
    const delta = newValue - baseValue;
    const percentChange = ((delta / baseValue) * 100).toFixed(1);
    const isPositive = delta > 0;
    const isNegative = delta < 0;

    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
            {label}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {prefix}
            {newValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          {delta !== 0 && (
            <span
              className={`text-sm font-semibold ${
                isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isPositive ? '+' : ''}
              {prefix}
              {delta.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Base: {prefix}
          {baseValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          {delta !== 0 && (
            <span
              className={`ml-2 font-semibold ${
                isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              ({isPositive ? '+' : ''}
              {percentChange}%)
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          What-If Scenario Simulator
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Simulate different business scenarios and see predicted outcomes
        </p>
      </div>

      {/* Preset Scenarios */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Quick Scenarios
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {scenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => handlePresetSimulation(index)}
              className={`p-3 rounded-lg border-2 transition-all ${
                scenario.active
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {scenario.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Scenario */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Custom Scenario
        </h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              Revenue Change (%)
            </label>
            <input
              type="number"
              value={customScenario.revenueChange}
              onChange={(e) =>
                setCustomScenario({ ...customScenario, revenueChange: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              Costs Change (%)
            </label>
            <input
              type="number"
              value={customScenario.costsChange}
              onChange={(e) =>
                setCustomScenario({ ...customScenario, costsChange: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              Price Change (%)
            </label>
            <input
              type="number"
              value={customScenario.priceChange}
              onChange={(e) =>
                setCustomScenario({ ...customScenario, priceChange: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              Staffing Change (%)
            </label>
            <input
              type="number"
              value={customScenario.staffingChange}
              onChange={(e) =>
                setCustomScenario({
                  ...customScenario,
                  staffingChange: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCustomSimulation}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            Run Simulation
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      {simulationResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {simulationResults.name}
              </h4>
              <p className={`text-sm font-medium ${simulationResults.recommendationColor}`}>
                {simulationResults.recommendation}
              </p>
            </div>
            {simulationResults.impact.profitDelta > 0 ? (
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            ) : simulationResults.impact.profitDelta < 0 ? (
              <XCircle className="w-8 h-8 text-red-500" />
            ) : (
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Revenue"
              baseValue={baseMetrics.revenue}
              newValue={simulationResults.results.revenue}
              icon={DollarSign}
            />
            <MetricCard
              label="Profit"
              baseValue={baseMetrics.revenue - baseMetrics.costs}
              newValue={simulationResults.results.profit}
              icon={TrendingUp}
            />
            <MetricCard
              label="Profit Margin"
              baseValue={
                ((baseMetrics.revenue - baseMetrics.costs) / baseMetrics.revenue) * 100
              }
              newValue={simulationResults.results.profitMargin}
              icon={Percent}
              prefix=""
            />
            <MetricCard
              label="Costs"
              baseValue={baseMetrics.costs}
              newValue={simulationResults.results.costs}
              icon={Package}
            />
          </div>

          {/* Impact Summary */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Impact Summary
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Revenue Impact:</span>
                <span
                  className={`font-bold ${
                    simulationResults.impact.revenueDelta > 0
                      ? 'text-green-600 dark:text-green-400'
                      : simulationResults.impact.revenueDelta < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {simulationResults.impact.revenueDelta > 0 ? '+' : ''}$
                  {simulationResults.impact.revenueDelta.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Profit Impact:</span>
                <span
                  className={`font-bold ${
                    simulationResults.impact.profitDelta > 0
                      ? 'text-green-600 dark:text-green-400'
                      : simulationResults.impact.profitDelta < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {simulationResults.impact.profitDelta > 0 ? '+' : ''}$
                  {simulationResults.impact.profitDelta.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Margin Impact:</span>
                <span
                  className={`font-bold ${
                    simulationResults.impact.marginDelta > 0
                      ? 'text-green-600 dark:text-green-400'
                      : simulationResults.impact.marginDelta < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {simulationResults.impact.marginDelta > 0 ? '+' : ''}
                  {simulationResults.impact.marginDelta.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScenarioSimulator;
