<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Expense Entity
 *
 * @property int $id
 * @property \Cake\I18n\FrozenDate $expense_date
 * @property float $amount
 * @property float $vat
 * @property string $reason
 * @property \Cake\I18n\FrozenTime $created
 * @property \Cake\I18n\FrozenTime $modified
 */
class Expense extends Entity
{

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        'expense_date' => true,
        'amount' => true,
        'vat' => true,
        'reason' => true,
        'created' => true,
        'modified' => true
    ];
}
