<?php
namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Expenses Model
 *
 * @method \App\Model\Entity\Expense get($primaryKey, $options = [])
 * @method \App\Model\Entity\Expense newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Expense[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Expense|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Expense|bool saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Expense patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Expense[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Expense findOrCreate($search, callable $callback = null, $options = [])
 *
 * @mixin \Cake\ORM\Behavior\TimestampBehavior
 */
class ExpensesTable extends Table
{

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->setTable('expenses');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');

        $this->addBehavior('Timestamp');
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator)
    {
        $validator
            ->integer('id')
            ->allowEmptyString('id', 'create');

        $validator
            ->date('expense_date')
            ->requirePresence('expense_date', 'create')
            ->allowEmptyDate('expense_date', false);

        $validator
            ->numeric('amount')
            ->requirePresence('amount', 'create')
            ->allowEmptyString('amount', false);

        $validator
            ->numeric('vat')
            ->requirePresence('vat', 'create')
            ->allowEmptyString('vat', false);

        $validator
            ->scalar('reason')
            ->requirePresence('reason', 'create')
            ->allowEmptyString('reason', false);

        return $validator;
    }
}
